# Official MCP Registry domain verification

> # Public ownership proof
> - [x] Prepare only the MCP Registry public Ed25519 verification record at `/.well-known/mcp-registry-auth` on nobi.ai. Keep the private signing key in ignored task-local storage with mode0600.
> - [ ] Use the official registry's supported HTTP authentication and `ai.nobi/shop-nobi` domain namespace. No GitHub token, password, security bypass, added user permissions or paid service.
> - [ ] Preserve all current site pages, assistant behavior, links and campaign assets.

> # Verification and release
> - [x] Verify the generated public/private key pair cryptographically, the exact record format and absence of private material from tracked files.
> - [ ] Run the existing offline build/tests, complete current-head PR review/Pages, merge and verify the actual public production proof.
> - [ ] Validate and publish the truthful remote-server metadata with the official publisher; independently retrieve the registry entry. Do not claim registry indexing, traffic or commission from merely adding the proof.
> - [ ] Close finished owned tabs immediately and verify owned inventory. Preserve the four inherited extension-blocked tabs and other agents' work.

Sources: official registry authentication and CLI documentation at https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/authentication.mdx and https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/cli/commands.md . This follows the registry's normal domain-ownership protocol; existing GitHub passkey authentication is left unchanged.

Validation: generated once using Node crypto Ed25519, verified a real sign/verify round trip and private0600 mode. All150 existing offline build/test cases pass, zero failures/skips, with external fetch denied. Built proof matches the source bytes, decodes to32 public-key bytes and contains no private material. The fixture server is stopped; no local production event or model call. Registry login/publication remain pending live production proof.
