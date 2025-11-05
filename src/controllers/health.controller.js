
export const HealthController = async (req, res) => {
  res.status(200).json({ status: 'OK', message: 'pong' });
};