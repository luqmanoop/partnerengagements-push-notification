export default {
  type: process.env.fb_type,
  projectId: process.env.fb_project_id,
  privateKeyId: process.env.fb_private_key_id,
  privateKey: process.env.fb_private_key.replace(/\\n/g, '\n'),
  clientEmail: process.env.fb_client_email,
  clientId: process.env.fb_client_id,
  authUri: process.env.fb_auth_uri,
  tokenUri: process.env.fb_token_uri,
  auth_provider_x509_cert_url: process.env.fb_auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.fb_client_x509_cert_url
};
