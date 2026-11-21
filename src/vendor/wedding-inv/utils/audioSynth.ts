/**
 * Wedding soundtrack. A local file we ship with the app — there is no Spotify
 * integration and never was; the old name (SPOTIFY_TRACK) sent readers looking
 * for an API key that does not exist.
 */

export const WEDDING_TRACK = {
  title: 'Dream Lantern',
  version: 'Kimi no Na wa (Instrumental)',
  artist: 'RADWIMPS',
  localAudioUrl: '/audio/ceremony.mp3',
};

class WeddingMusicPlayer {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private listeners: Set<(playing: boolean) => void> = new Set();
  private userInteractionBound: boolean = false;
  private userRequestedPlay: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Lazy init audio on first tick or user gesture
      this.initAudio();
    }
  }

  private initAudio(): HTMLAudioElement | null {
    if (this.audio) return this.audio;
    if (typeof window === 'undefined') return null;

    try {
      this.audio = new Audio(WEDDING_TRACK.localAudioUrl);
      this.audio.preload = 'none'; // preload:'none' — the file is 1.7 MB, so it is not fetched until the guest asks
      this.audio.loop = true;
      this.audio.volume = 0.8;

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      this.audio.addEventListener('ended', () => {
        // If loop didn't automatically repeat
        if (this.userRequestedPlay && this.audio) {
          this.audio.currentTime = 0;
          this.audio.play().catch(() => {});
        } else {
          this.isPlaying = false;
          this.notify();
        }
      });

      this.audio.addEventListener('error', (e) => {
        // No cross-song fallback: playing a different track would be worse than
        // silence. The soundtrack file must exist at WEDDING_TRACK.localAudioUrl.
        console.warn('Wedding audio load notice:', e);
        this.isPlaying = false;
        this.notify();
      });
    } catch (err) {
      console.warn('Audio element initialization notice:', err);
    }

    return this.audio;
  }

  private bindUnlockOnGesture() {
    if (this.userInteractionBound || typeof window === 'undefined') return;
    this.userInteractionBound = true;

    const unlockHandler = () => {
      if (this.userRequestedPlay && this.audio && this.audio.paused) {
        this.audio.play()
          .then(() => {
            this.isPlaying = true;
            this.notify();
          })
          .catch(() => {});
      }
      window.removeEventListener('click', unlockHandler);
      window.removeEventListener('touchstart', unlockHandler);
      this.userInteractionBound = false;
    };

    window.addEventListener('click', unlockHandler, { once: true });
    window.addEventListener('touchstart', unlockHandler, { once: true });
  }

  public play(): boolean {
    const audio = this.initAudio();
    this.userRequestedPlay = true;

    if (!audio) {
      return false;
    }

    // Ensure volume is properly set and buffer audio on demand
    audio.preload = 'auto';
    audio.volume = 0.8;
    audio.loop = true;

    const promise = audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          this.isPlaying = true;
          this.notify();
        })
        .catch((error) => {
          console.warn('Audio play waiting for user gesture:', error.name);
          this.isPlaying = false;
          this.notify();
          // Bind fallback listener on first user click to resume
          this.bindUnlockOnGesture();
        });
    } else {
      this.isPlaying = true;
      this.notify();
    }

    return true;
  }

  public pause(): boolean {
    this.userRequestedPlay = false;
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
    this.notify();
    return false;
  }

  public toggle(): boolean {
    if (this.isPlaying && this.audio && !this.audio.paused) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getPlaying(): boolean {
    return this.isPlaying;
  }

  public subscribe(cb: (playing: boolean) => void): () => void {
    this.listeners.add(cb);
    // Initial emit
    cb(this.isPlaying);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.isPlaying);
      } catch (err) {
        console.error(err);
      }
    });
  }
}

export const weddingMusic = new WeddingMusicPlayer();

