# frozen_string_literal: true

require 'roda'
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

  def message(from = 0)
    @messages[from..-1]
  end

  def message=(payload)
    @messages << payload
  end
end

class NewsPerformer
  class << self
    def perform(message)
      type = message.include?('voice-it') ? :voice : :text
      case type
      when :voice
        base64_string = prepare_voice_message(message)
        pack(base64_string, type)
      when :text
        pack(message, type)
      end
    end

    private

    def pack(message, type)
      [message, type]
    end

    def prepare_voice_message(message)
      voice_file_path = Dir.pwd + '/message_' + hash.to_s + 'voice.mp3'
      message.gsub!('voice-it', '')
      message.to_file('ru', voice_file_path)
      if File.exist?(voice_file_path)
        mp3 = File.read(voice_file_path)
        'data:audio/mp3;base64,' + Base64.encode64(mp3)
      end
    ensure
      File.delete(voice_file_path) if File.exist?(voice_file_path)
    end
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
        from = r.params['from'].to_i
        stack = MessageStack.instance
        messages = stack.message(from)
        response.headers['Content-Type'] = 'application/json'
        response.status = 200
        { data: messages }.to_json
      end
    end

    r.post do
      r.on 'slack' do
        payload = JSON.parse(r.body.read)
        message = payload.dig('event', 'text')
        stack = MessageStack.instance
        stack.message = NewsPerformer.perform(message) if message
        response.status = 200
        payload['challenge']
      end
    end
  end
end

run Mokaka.app
