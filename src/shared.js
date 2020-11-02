export function dateFormatted(date) {
  const newDate = new Date(date);
  return newDate.getFullYear() + '-' + padNr(newDate.getMonth() + 1) + '-' + padNr(newDate.getDate());
}

function padNr(nr) {
  return nr < 10 ? '0' + nr : nr;
}

export function processUrl(url) {
  if (url.indexOf('http://') != 0 &&
    url.indexOf('https://') != 0) {
    url = 'https://' + url;
  }

  try {
    let processedUrl = new URL(url);
    return processedUrl.protocol + '//' + processedUrl.hostname;
  } catch {
    return false;
  }
}

export function removeHttp(url) {
  return new URL(url).host;
}

export function getSmallestImg(data) {
  if (typeof data !== 'object' || data === null) {
    return;
  }
  const srcSizes = JSON.parse(JSON.stringify(data));
  const media = Object.values(srcSizes).map(
    value => {
      return {
        width: value.width,
        source_url: value.source_url,
      }
    }
  );
  if (!media.length) {
    return;
  }
  const smallest = Math.min(...media.map(v => v.width));
  return media.find(v => v.width == smallest).source_url;
}

export default {
  dateFormatted,
  processUrl,
  removeHttp,
};