require 'net/https'
require 'net/http'
require 'uri'
require 'json'


travis_domain = 'api.travis-ci.com'

# Get environment variables
should_build_docs = %w[1 true].include? ENV['SHOULD_BUILD_DOCS']
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
#   - TRAVIS_EVENT_TYPE environment variable is set to 'push'.
#   - TRAVIS_API_TOKEN environment variable specified.
#   - SHOULD_BUILD_DOCS environment variable is set to '1'.
#   - TRAVIS_BRANCH environment variable is set to 'master'.
#   - TRAVIS_COMMIT_MESSAGE environment variable doesn't contain '[skip docs]' in it.
#   - There is changes in folders which tracked for docs update.
if !is_able_to_create_docs || !is_push || !is_master ||
   should_skip_docs || !has_changes
  exit 0
end

# Compose request to create new build for 'chat-resource-center' repository.
uri = URI.parse("https://#{travis_domain}/repo/pubnub%2Fchat-resource-center/requests")
request_data = { request: { branch: 'master' } }
headers = {
  'Content-Type': 'application/json',
  'Travis-API-Version': '3',
  'Authorization': "token #{token}"
}

http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true
http.verify_mode = OpenSSL::SSL::VERIFY_PEER
request = Net::HTTP::Post.new(uri.request_uri, headers)
request.body = JSON.dump(request_data)

# Make call to Travis REST API to push new build for 'chat-resource-center'.
http.request(request)
