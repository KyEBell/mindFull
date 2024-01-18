const loginUrl = import.meta.env.VITE_BASE_API_URL + 'login';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

async function userLoginService(
  identifier: string,
  password: string
): Promise<LoginResponse> {
  try {
    console.log('username', identifier, 'password', password);
    console.log('loginURL', loginUrl);
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

    console.log('response from login service', response);
    const data: LoginResponse = await response.json();
    // console.log('Parsed data:', data);

    return data;
  } catch (error) {
    console.error('Login Error', error);
    throw new Error('Login Failed');
  }
}

export default userLoginService;
