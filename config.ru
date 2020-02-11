# frozen_string_literal: true

map '/' do
  use Rack::Static, urls: [''],
                    root: File.expand_path('./app'),
                    index: 'index.html'
  run -> {}
end
