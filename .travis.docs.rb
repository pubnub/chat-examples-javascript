require 'net/http'
require 'uri'
require 'json'


# Get environment variables
should_build_docs = %w[1 true].include? ENV['SHOULD_BUILDS_DOCS']
commit_message = ENV['TRAVIS_COMMIT_MESSAGE']
has_token = ENV.key? 'TRAVIS_API_TOKEN'
is_push = ENV['TRAVIS_EVENT_TYPE'] == 'push'
token = ENV['TRAVIS_API_TOKEN']
branch = ENV['TRAVIS_BRANCH']


# Check whether script able and should trigger docs build if possible.
is_able_to_create_docs = should_build_docs && has_token

# Gather information about repository and last commit.
has_changes = `git diff --name-only HEAD~1 HEAD | grep '^snippets/' -c`.to_i > 0
should_skip_docs = commit_message.include? '[skip docs]'
is_master = branch == 'master'


# Skip documents generation in case if one of following requests not met:
#   - Job has been triggered by push.
#   - Script has been launched with '--token TOKEN'
#   - Script has been launched with '--docs 1'
#   - Script called from master branch
#   - There is no '[skip docs]' in last commit message
#   - There is changes in folders which tracked for docs update.
if !is_able_to_create_docs || !is_push || !is_master ||
   should_skip_docs || !has_changes
  exit 0
end

# Compose request to create new build for 'chat-resource-center' repository.
uri = URI.parse('https://api.travis-ci.org/repo/pubnub%2Fchat-resource-center/requests')
request_data = { request: { branch: 'master' } }
headers = {
  'Content-Type': 'application/json',
  'Travis-API-Version': '3',
  'Authorization': "token #{token}"
}

http = Net::HTTP.new(uri.host)
request = Net::HTTP::Post.new(uri.request_uri, headers)
request.body = request_data.to_json

puts "Request uri: #{uri}"
puts "Request headers: #{headers}"
puts "Request body: #{request.body}"

# Make call to Travis REST API to push new build for 'chat-resource-center'.
response = http.request(request)

puts "Service response: #{response}"
