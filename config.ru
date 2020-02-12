# frozen_string_literal: true
require 'roda'
require 'byebug'
require 'json'
require 'tts'
require 'base64'
require 'singleton'

class MessageStack
  include Singleton
  
  def initialize
    @messages = []
    super
  end

  def message
    @messages.shift
  end

  def message=(payload)
    @messages.unshift(payload)
  end
end

class NewsPerformer
  def self.perform(message)
    method = message.include?('voice-it') ? :voice : :text
    case method
    when :voice
      base64_string = prepare_voice_message(message)
      send_to_site(base64_string, method)
    when :text
      send_to_site(message, method)
    end
  end

  private

  def self.send_to_site(message, method)
    MessageStack.instance.message = "#{message}=>#{method}"
  end

  def self.prepare_voice_message(message)
    voice_file_path = Dir.pwd + '/message_' + hash.to_s + 'voice.mp3'
    message.gsub!('voice-it', '')
    message.to_file('ru', voice_file_path)
    if File.exists?(voice_file_path)
      mp3 = File.read(voice_file_path)
      base64_string = Base64.encode64(mp3)
      return base64_string
    end
  ensure
    File.delete(voice_file_path) if File.exists?(voice_file_path)
  end
end

class Mokaka < Roda
  plugin :static, ['/index.html'], root: './public'
  plugin :static, ['/js', '/css', '/img'], root: './public'

  route do |r|
    r.root do
      puts 'Get said!'
    end

    r.get do
      r.on 'news' do
        stack = MessageStack.instance
        message = stack.message
        response.headers['Content-Type'] = 'application/json'
        response.status = 200
        if message
          text, type = message.split("=>")
          { data: text, type: type}.to_json
        else
          response.status = 404
          '{"data": false, "type":false}'
        end
      end
    end

    r.post do
      r.on 'slack' do
        payload = JSON.parse(r.body.read)
        message = payload.dig(*%w[event text])
        stack = MessageStack.instance
        stack.message= NewsPerformer.perform(message) if message
        response.status = 200
        payload['challenge']
      end
    end
  end
end

run Mokaka.app