const url = 'http://localhost:3000/api/token/refresh';

interface TokenRefreshResponse {
  accessToken: string;
}

const refreshTokenService = async (
  refreshToken: string
): Promise<TokenRefreshResponse> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  } catch (error) {
    console.error('Token refresh error:', error);
    throw new Error('Token refresh failed');
  }
};

export { refreshTokenService };
