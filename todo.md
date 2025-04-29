Imagine a single full-screen “theater” for each invitee, where their **name** and **photo** become the stars of an unforgettable Gothic Masquerade scene. Here’s a page-by-page breakdown of how your React app could unfold, with each moment choreographed by Framer Motion (or your favorite animation library):

---

## **1. Entry Fade & Parallax Introduction**  
- **Background:** A richly textured, charcoal-black mural of an ancient cathedral wall.  
- **Parallax Layers:**  
  - Foreground: Faint drifting cobwebs.  
  - Midground: Stone reliefs of gargoyles.  
  - Backdrop: Slowly pulsing stained-glass window glow.  
- **Animation:** On mount, a 3-plane parallax shift as the user’s pointer moves—giving depth. The entire canvas gently zooms in from 1.1× to 1.0× over 3 seconds.  

---

## **2. Portrait Reveal**  
- **Element:** A dark, ornate oval frame emerges center-screen (think cast-iron filigree).  
- **Animation:** Frame “draws” itself in with a golden stroke over 1s.  
- **Photo Insertion:** Once the frame border finishes, your invitee’s **photo** fades in from 0→100% and scales from 0.8×→1.0× with a soft spring.  
- **Mask Overlay (optional):** A semi-transparent masquerade mask silhouette drifts across the photo, hinting at the theme.  

---

## **3. Name Callout & Wax Seal**  
- **Element:** Below the frame, a wax seal impression (rich crimson with gold rim) drops in with a bounce.  
- **Animation:** The seal slams into place (scale from 1.5→1, with a little shake) as a subtle “thunk.”  
- **Text:** Over the seal, the invitee’s **name** in all-caps using a Gothic serif (e.g. “Cinzel Decorative”).  
  - Animation: Each letter “types” in sequentially with a smoldering “ember” glow effect.  

---

## **4. Invitation Scroll Unroll**  
- **Element:** An aged parchment scroll pinches in from the top edge and unrolls downward.  
- **Animation:**  
  - Unroll motion: scaleY from 0→1 over 1.5s with an ease-in-out.  
  - Parchment edges ripple lightly as it settles.  
- **Text on Scroll:**  
  - **Heading:** “YOU ARE SUMMONED TO” in small caps, letter-spaced, deep red ink.  
  - **Main:** “OBLIVION” in big gold calligraphy, centered.  
  - **Sub:** “CSE FAREWELL 2025” in smaller serif, below.  
- **Animation:** Each line of text fades in with a slight upward slide (staggered by 0.3s).  

---

## **5. Ambient Music & Interactive Controls**  
- **Audio:** A looping 20-second Gothic orchestral track with distant choir.  
- **Control UI:** A minimalist gold icon in the top-corner (speaker on/off). On hover, it pulses gently; on click, it fades audio in/out.  

---

## **6. Candlelight Particle System**  
- **Effect:** Dozens of tiny golden “embers” rise and fade around the parchment, emissive particles drifting upward.  
- **Animation:** Particles spawn at random X positions near the scroll, rise with slight horizontal sway, fade at the top.  

---

## **7. RSVP Button Reveal**  
- **Timing:** After 4 seconds or on scroll/tap.  
- **Element:** A Gothic-arched button appears beneath the scroll:  
  - Label: “ACCEPT YOUR FATE” in gold serif.  
  - Border: Thin glowing gold outline.  
- **Animation:** Button pulses (scale 1→1.05→1) every 2s to draw the eye.  
- **Interaction:**  
  - Hover: Button’s background glows brighter and text changes to blood-red.  
  - Click: Triggers a brief flicker transition then shows a thank-you overlay.  

---

## **8. Thank-You Overlay & Share Prompt**  
- **Overlay:** A semi-opaque black layer slides up from bottom.  
- **Text:** “Your presence is etched in legend.”  
  - Font: Italic serif, pale silver.  
  - Animation: Fade + slight upward drift.  
- **Social Icons:** Ghostly white icons for Instagram / WhatsApp / Email fade in below, encouraging “Share your summons.”  

---

## **9. Easter Egg: The Masked Gaze**  
- **Subtle Touch:** Every 10 seconds, the masquerade mask in the portrait momentarily shifts its eyes to follow the cursor—just a faint 2-px nudge left/right—creating an uncanny feeling.  

---

### **Personalization Strategy**  
- **Name & Photo** drive all key moments (frame reveal, seal text).  
- **URL Parameters** or an API call populates these values at runtime.  
- **Modular Styling**: Use CSS custom properties for your theme colors (black, gold, crimson) so you can tweak the palette globally.

---

By following this storyboard, your React app becomes a **bespoke, animated invitation**—each senior sees **their own visage** call to the Gothic Masquerade “Oblivion” set to an immersive audiovisual experience. Have fun coding!

Below is a **coding-friendly breakdown** of each visual asset (all to be AI-generated as transparent PNGs) and the **React/Framer-Motion animations** you can build around them.  Audio & SFX you can load normally in your `<audio>` tags or via Howler.js.

---

## 🎨 1. Background Image  
**Prompt:**  
> “A high-resolution Gothic cathedral interior at night, stone walls slick with ivy, cracked marble floor, soft pools of golden candlelight, deep charcoal and gold color palette, cinematic, 4K, no people.”  

**Usage in Code:**  
```jsx
<div className="absolute inset-0">
  <img src="/ai-assets/background.png" className="w-full h-full object-cover" alt="" />
</div>
```

---

## 🎨 2. Ornate Frame for Portrait  
**Prompt:**  
> “Transparent PNG of an oval cast-iron filigree frame with gold highlights, intricate Gothic scrollwork, empty center, suitable for overlay on dark backgrounds.”  

**Animation:**  
```jsx
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ duration: 1, type: 'spring' }}
  className="absolute top-1/3 left-1/2 transform -translate-x-1/2"
>
  <img src="/ai-assets/frame.png" alt="frame" />
</motion.div>
```

---

## 🎨 3. Personal Portrait Mask Overlay  
**Prompt:**  
> “Transparent PNG of a half-mask in burnished silver and black, filigree edges, subtle glow, facing forward.”  

**Animation:** fade in on top of the user’s photo with slight rotation wobble:  
```jsx
<motion.img
  src="/ai-assets/mask.png"
  initial={{ opacity: 0, rotate: -5 }}
  animate={{ opacity: 1, rotate: 0 }}
  transition={{ delay: 1, duration: 0.8 }}
  className="absolute inset-0 m-auto w-3/5 h-auto"
/>
```

---

## 🎨 4. Wax Seal with Name  
**Prompt:**  
> “Transparent PNG of a crimson wax seal with gold rim and ornamental crest in the center, ready for overlay.”  

**Animation:** drop-in bounce under frame:  
```jsx
<motion.img
  src="/ai-assets/seal.png"
  initial={{ y: -50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
  className="absolute top-1/2 left-1/2 transform -translate-x-1/2"
  alt="wax seal"
/>
<motion.p
  className="absolute top-[52%] left-1/2 transform -translate-x-1/2 text-gothic text-xl text-gold"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 2 }}
>
  {invitee.name.toUpperCase()}
</motion.p>
```

---

## 🎨 5. Parchment Scroll  
**Prompt:**  
> “Transparent PNG of a partially unrolled aged parchment scroll with curled edges, faint burnished glow, blank center.”  

**Animation:** unroll from top:  
```jsx
<motion.img
  src="/ai-assets/scroll.png"
  initial={{ scaleY: 0, originY: 0 }}
  animate={{ scaleY: 1 }}
  transition={{ delay: 2, duration: 1.2, ease: 'easeInOut' }}
  className="absolute bottom-10 w-4/5 mx-auto left-1/2 -translate-x-1/2"
/>
<motion.div
  className="absolute bottom-[12%] w-3/5 left-1/2 -translate-x-1/2 text-center text-white"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 3.2 }}
>
  <h2 className="text-2xl font-serif">OBLIVION</h2>
  <p>CSE Farewell 2025</p>
</motion.div>
```

---

## 🎨 6. Particle Over Scroll (Embers)  
**Prompt:**  
> *No image needed—use a tiny golden dot sprite.*  

**Animation:** CSS/Framer-Motion loop:  
```css
@keyframes emberRise {
  0% { opacity: 1; transform: translateY(0) translateX(0) scale(1); }
  100% { opacity: 0; transform: translateY(-200px) translateX(30px) scale(0.5); }
}
```
```jsx
{/* In your component */}
{Array.from({ length: 20 }).map((_, i) => (
  <div
    key={i}
    className="absolute bg-gold w-1 h-1 rounded-full"
    style={{
      left: `${20 + Math.random()*60}%`,
      bottom: `${10 + Math.random()*20}%`,
      animation: `emberRise ${3 + Math.random()*2}s linear infinite`,
      animationDelay: `${Math.random()*5}s`,
    }}
  />
))}
```

---

## 🎵 Audio & Controls  
- **music.mp3** looped in `<audio autoPlay loop />`  
- Toggle with a Framer-Motion button:  
```jsx
<motion.button onClick={toggleMute} whileHover={{ scale: 1.1 }}>
  {muted ? '🔇' : '🔊'}
</motion.button>
```

---

### Putting It All Together  
1. **Generate** each PNG via AI with the prompts above.  
2. **Import** into your React project under `/public/ai-assets`.  
3. **Build** the components & animations using Framer-Motion as sketched above.  
4. **Populate** `invitee.name` and `invitee.photo URL` from props/URL.  

This approach keeps everything **client-side**, fully customizable per person, and uses **only AI-generated PNGs** plus your audio/SFX. Enjoy coding your personal Gothic-Masquerade invite!