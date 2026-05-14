import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
})
export class FileSizePipe implements PipeTransform {
  transform(bytes: number | string | null | undefined, decimals: number = 2): string {
    if (bytes === null || bytes === undefined) return '0 B';

    const value = Number(bytes);

    if (!Number.isFinite(value) || value <= 0) return '0 B';

    const k = 1024;
    const dm = Math.max(decimals, 0);
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.min(Math.floor(Math.log(value) / Math.log(k)), sizes.length - 1);

    return `${parseFloat((value / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
}
