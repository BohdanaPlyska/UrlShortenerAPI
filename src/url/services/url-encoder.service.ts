import { Injectable } from '@nestjs/common';

@Injectable()
export class UrlEncoderService {
  private readonly chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  encodeId(id: number): string {
    let shortUrl = '';
    const base = this.chars.length;

    while (id > 0) {
      shortUrl = this.chars[id % base] + shortUrl;
      id = Math.floor(id / base);
    }

    while (shortUrl.length < 6) {
      shortUrl = this.chars[0] + shortUrl;
    }

    return shortUrl;
  }

  decodeShortUrl(shortUrl: string): number {
    let id = 0;
    const base = this.chars.length;

    let i = 0;
    while (i < shortUrl.length && shortUrl[i] === this.chars[0]) {
      i++;
    }

    for (; i < shortUrl.length; i++) {
      const charIndex = this.chars.indexOf(shortUrl[i]);
      if (charIndex === -1) {
        throw new Error(`Invalid character found in short URL: ${shortUrl[i]}`);
      }
      id = id * base + charIndex;
    }

    return id;
  }
}
