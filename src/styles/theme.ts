export const iPodTheme = {
  shell: {
    silver: {
      // Front panel - smooth white/silver plastic like real iPod
      front: `
        linear-gradient(180deg,
          #f0f0f0 0%,
          #e8e8e8 20%,
          #e4e4e4 50%,
          #e0e0e0 80%,
          #d8d8d8 100%
        )
      `,
      // Chrome edge/side
      edge: `
        linear-gradient(90deg,
          #c0c0c0 0%,
          #e8e8e8 15%,
          #f5f5f5 50%,
          #e8e8e8 85%,
          #c0c0c0 100%
        )
      `,
      border: '#b0b0b0',
      shadow: `
        0 25px 50px rgba(0,0,0,0.25),
        0 10px 20px rgba(0,0,0,0.15),
        0 0 0 1px rgba(0,0,0,0.08)
      `,
    },
    black: {
      front: `
        linear-gradient(180deg,
          #2a2a2a 0%,
          #222222 20%,
          #1e1e1e 50%,
          #1a1a1a 80%,
          #151515 100%
        )
      `,
      edge: `
        linear-gradient(90deg,
          #1a1a1a 0%,
          #2a2a2a 15%,
          #333333 50%,
          #2a2a2a 85%,
          #1a1a1a 100%
        )
      `,
      border: '#0a0a0a',
      shadow: `
        0 25px 50px rgba(0,0,0,0.4),
        0 10px 20px rgba(0,0,0,0.3),
        0 0 0 1px rgba(0,0,0,0.5)
      `,
    },
  },

  screen: {
    // Classic iPod LCD - white/light gray backlight
    background: '#ffffff',
    // Slight warmth to the LCD
    tint: 'rgba(248, 250, 252, 1)',
    text: '#000000',
    textSecondary: '#666666',
    // Classic blue selection bar
    selection: `
      linear-gradient(180deg,
        #5c9cff 0%,
        #3a7bd5 30%,
        #2968c8 70%,
        #1e58b8 100%
      )
    `,
    selectionFlat: '#3a7bd5',
    selectionText: '#ffffff',
    border: '#4a4a4a',
    bezel: '#1a1a1a',
  },

  wheel: {
    silver: {
      // Click wheel - slightly lighter than body, very subtle
      background: `
        radial-gradient(ellipse at 50% 45%,
          #f8f8f8 0%,
          #f0f0f0 40%,
          #e8e8e8 70%,
          #e0e0e0 100%
        )
      `,
      // Center button - glossy white
      center: `
        radial-gradient(ellipse at 50% 35%,
          #ffffff 0%,
          #fafafa 40%,
          #f0f0f0 70%,
          #e8e8e8 100%
        )
      `,
      centerBorder: 'rgba(0,0,0,0.08)',
      text: '#8a8a8a',
      activeText: '#4a4a4a',
    },
    black: {
      background: `
        radial-gradient(ellipse at 50% 45%,
          #2a2a2a 0%,
          #222222 40%,
          #1a1a1a 70%,
          #151515 100%
        )
      `,
      center: `
        radial-gradient(ellipse at 50% 35%,
          #3a3a3a 0%,
          #2a2a2a 40%,
          #222222 70%,
          #1a1a1a 100%
        )
      `,
      centerBorder: 'rgba(255,255,255,0.05)',
      text: '#666666',
      activeText: '#999999',
    },
  },

  // More accurate iPod Classic dimensions
  dimensions: {
    shellWidth: 250,
    shellHeight: 418,
    shellRadius: 18,
    screenWidth: 200,
    screenHeight: 150,
    screenRadius: 3,
    bezelPadding: 10,
    wheelSize: 168,
    wheelCenterSize: 56,
    wheelGap: 28, // Gap between screen and wheel
  },

  animation: {
    menuTransition: 0.18,
    scrollSmooth: 0.12,
    buttonPress: 0.06,
  },
}

export type iPodThemeType = typeof iPodTheme
export type ShellVariant = 'silver' | 'black'
