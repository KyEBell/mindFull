const loginUrl = import.meta.env.VITE_BASE_API_URL + 'login';
import { User } from '../store/AuthProvider';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

async function userLoginService(
  identifier: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Login Failed');
    }

    const data: LoginResponse = await response.json();

    return data;
  } catch (error) {
    console.error('Login Error', error);
    throw new Error('Login Failed');
  }
}

export default userLoginService;
