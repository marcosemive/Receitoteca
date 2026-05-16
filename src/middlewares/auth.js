import jwt from 'jsonwebtoken';

const SECRET = 'receitoteca_secret_2026';

export function gerarToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' });
}

export function autenticarChef(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.tipo !== 'chef') {
      return res.status(403).json({ message: 'Acesso restrito a chefs' });
    }
    req.chef = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

export function autenticarUsuario(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.tipo !== 'usuario') {
      return res.status(403).json({ message: 'Acesso restrito a usuários' });
    }
    req.usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}
