# Font Files

This directory should contain the following font files:

- Inter-Regular.ttf
- Inter-Medium.ttf
- Inter-SemiBold.ttf
- Inter-Bold.ttf

## How to add the fonts

1. Download the Inter font family from Google Fonts: https://fonts.google.com/specimen/Inter

2. Extract the downloaded zip file and copy the following font files to this directory:
   - Inter-Regular.ttf
   - Inter-Medium.ttf
   - Inter-SemiBold.ttf
   - Inter-Bold.ttf

3. After adding the font files, uncomment the font loading code in `app/_layout.tsx`:
   ```typescript
   import { useFonts } from 'expo-font';
   
   const [loaded, error] = useFonts({
     'Inter-Regular': require('@/assets/fonts/Inter-Regular.ttf'),
     'Inter-Medium': require('@/assets/fonts/Inter-Medium.ttf'),
     'Inter-SemiBold': require('@/assets/fonts/Inter-SemiBold.ttf'),
     'Inter-Bold': require('@/assets/fonts/Inter-Bold.ttf'),
   });
   ```

4. Restart your Expo development server with the `--clear` flag:
   ```
   npx expo start --clear
   ```

## Troubleshooting

If you encounter font loading issues:

1. Make sure the font files are correctly named and placed in this directory
2. Check that the paths in `app/_layout.tsx` match the actual file locations
3. Clear the Metro bundler cache with `npx expo start --clear`
4. Verify that the font files are included in the Expo asset bundle patterns in `app.json`
5. If using a web build, ensure the fonts are properly included in the web bundle

## Alternative approach

If you continue to have issues with font loading, you can use Google Fonts with Expo Web:

1. Add the following to your `app.json` in the `web` section:
   ```json
   "web": {
     "bundler": "metro",
     "favicon": "./assets/images/favicon.png",
     "meta": {
       "googleFonts": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
     }
   }
   ```

2. Then use the font in your styles without loading it explicitly:
   ```javascript
   const styles = StyleSheet.create({
     text: {
       fontFamily: 'Inter, system-ui, sans-serif',
       // other styles
     }
   });
   ```

## Important Note

For proper path resolution, use the `@/` alias instead of relative paths:

```typescript
// Correct
import { something } from '@/components/Something';
require('@/assets/fonts/Inter-Regular.ttf')

// Incorrect
import { something } from '../components/Something';
require('../assets/fonts/Inter-Regular.ttf')
```

This ensures consistent path resolution across the app.