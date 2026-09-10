import jwtVerify from "../utils/jwtVerify.js";
export default async function authorize(req, res, next) {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res
      .status(401)
      .json({ error: true, message: "Access Token not found" });
  }

  const decoded = jwtVerify(accessToken, "access");

  req.user = { id: decoded.id, sessionId: decoded.sessionId };
  next();
}
