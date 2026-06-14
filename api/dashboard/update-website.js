export default async function handler(req, res) {
  return res.status(403).json({
    success: false,
    message: 'Only the administrator can bind or modify website tracking domains. Please contact support.',
  });
}
