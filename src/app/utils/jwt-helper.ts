export interface JwtPayload {
  sub?: string;
  username?: string;
  roles?: string[];
  exp?: number;
  iat?: number;
  [key: string]: any;
}

export class JwtHelper {
  /**
   * Decodifica un token JWT sin verificar la firma
   */
  static decodeToken(token: string): JwtPayload | null {
    if (!token) {
      return null;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1];
      const decoded = this.base64UrlDecode(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  /**
   * Verifica si un token ha expirado
   */
  static isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  /**
   * Obtiene el tiempo restante hasta la expiración en segundos
   */
  static getTokenExpirationTime(token: string): number | null {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return null;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp - currentTime;
  }

  /**
   * Decodifica una cadena Base64 URL
   */
  private static base64UrlDecode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');

    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw new Error('Base64 string no válida');
    }

    return atob(output);
  }

  /**
   * Verifica si un token es válido en formato
   */
  static isValidJwtFormat(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    const parts = token.split('.');
    return parts.length === 3;
  }
}
