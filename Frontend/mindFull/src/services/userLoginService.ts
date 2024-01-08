const url = 'http://localhost:3000/api/login/';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

async function userLoginService(
  username: string,
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    console.log('username', username, 'password', password);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
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
