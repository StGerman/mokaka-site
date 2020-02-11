# frozen_string_literal: true

require 'roda'

# Mokaka Web Server
class Mokaka < Roda
  plugin :static, ['/index.html'], root: './public'
  plugin :static, ['/js', '/css', '/img'], root: './public'

  route do |r|
    r.root do
      puts 'Get said!'
    end

    r.post do
      puts 'Post said!'
    end
  end
end

run Mokaka.freeze.app
