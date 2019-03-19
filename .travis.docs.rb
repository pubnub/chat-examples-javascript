require 'net/http'
require 'optparse'
require 'uri'
require 'json'


puts "Should build docs ENV: #{ENV['SHOULD_BUILDS_DOCS']}"
puts "API token ENV: #{ENV['TRAVIS_API_TOKEN']}"
puts "Branch from ENV: #{ENV['TRAVIS_BRANCH']}"
puts "Commit message from ENV: #{ENV['TRAVIS_COMMIT_MESSAGE']}"
puts "Event type from ENV: #{ENV['TRAVIS_EVENT_TYPE']}"
puts "Is push event type from ENV: #{ENV['TRAVIS_EVENT_TYPE'] == 'push'}"


# Configure script launch options.
options = {}
OptionParser.new do |parser|
  parser.banner = 'Usage: .travis.docs.rb [options]'

  parser.on('-d', '--docs [FLAG]', 'Enable docs generation.') do |v|
    options[:docs] = %w[1 true].include? v
  end

  parser.on('-t', '--token TOKEN', 'Travis REST API access token.') do |v|
    options[:token] = v
  end
end.parse!

# Check whether script able and should trigger docs build if possible.
is_able_to_create_docs = ENV['SHOULD_BUILDS_DOCS'] == '1' && ENV['TRAVIS_EVENT_TYPE'] == 'push'

# Gather information about repository and last commit.
has_changes = `git diff --name-only HEAD~1 HEAD | grep '^snippets/' -c`.to_i > 0
should_skip_docs = `\""#{ENV['TRAVIS_COMMIT_MESSAGE']}"\" | grep -F '[skip docs]' -c`.to_i > 0
is_master = ENV['TRAVIS_BRANCH'] == 'master'

puts "Branch name: #{`\""#{ENV['TRAVIS_COMMIT_MESSAGE']}"\" | grep -F '[skip docs]' -c`.to_i}"
puts "Has changes? #{has_changes}"

# Skip documents generation in case if one of following requests not met:
#   - Script has been launched with '--token TOKEN'
#   - Script has been launched with '--docs 1'
#   - Script called from master branch
#   - There is no '[skip docs]' in last commit message
#   - There is changes in folders which tracked for docs update.
if !is_able_to_create_docs || !is_master || should_skip_docs || !has_changes
  puts 'Skip docs generation'
  exit 0
end

puts 'Push docs build job'

# Compose request to create new build for 'chat-resource-center' repository.
uri = URI.parse('https://api.travis-ci.org/repo/pubnub%2Fchat-resource-center/requests')
request_data = { request: { branch: 'master' } }
headers = {
  'Content-Type': 'application/json',
  'Travis-API-Version': '3',
  'Authorization': "token #{ENV['TRAVIS_API_TOKEN']}"
}

http = Net::HTTP.new(uri.host)
request = Net::HTTP::Post.new(uri.request_uri, headers)
request.body = request_data.to_json

# Make call to Travis REST API to push new build for 'chat-resource-center'.
http.request(request)
