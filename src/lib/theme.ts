import { Theme } from '@aws-amplify/ui-react';

// Definimos los colores estilo Spotify
export const spotifyTheme: Theme = {
  name: 'spotify-dark-theme',
  tokens: {
    colors: {
      background: {
        primary: { value: '#121212' }, // Fondo negro
        secondary: { value: '#282828' }, // Fondo gris oscuro
      },
      font: {
        interactive: { value: '#ffffff' },
        primary: { value: '#ffffff' }, 
        secondary: { value: '#b3b3b3' },
      },
      brand: {
        primary: {
          10: { value: '#1DB954' },
          80: { value: '#1DB954' }, // EL VERDE SPOTIFY
          90: { value: '#1ed760' }, // Hover más brillante
          100: { value: '#169c46' }, 
        },
      },
    },
    components: {
      authenticator: {
        router: {
          borderStyle: { value: 'none' },
          boxShadow: { value: '0 4px 12px rgba(0,0,0,0.5)' },
        },
      },
      button: {
        primary: {
            backgroundColor: { value: '{colors.brand.primary.80}' },
            _hover: {
                backgroundColor: { value: '{colors.brand.primary.90}' },
            }
        },
        link: {
            color: { value: '{colors.font.primary}' }
        }
      },
      input: {
          color: { value: '{colors.font.primary}' },
          borderColor: { value: 'transparent' },
      },
      tabs: {
        item: {
            color: { value: '{colors.font.secondary}' },
            _active: {
                color: { value: '{colors.font.primary}' },
                borderColor: { value: '{colors.brand.primary.80}' }
            },
        }
      }
    },
  },
};