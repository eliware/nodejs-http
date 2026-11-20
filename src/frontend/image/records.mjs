import imageRecordFilterApi from "./records/filter.mjs";
const { filterImageRecords } = imageRecordFilterApi();
import imageRecordNormalizerApi from "./records/normalize.mjs";
const { normalizeImageRecord } = imageRecordNormalizerApi();

function imageRecords(data) {
  return filterImageRecords(data).map(normalizeImageRecord);
}

export default function __moduleApi0() {
  return { imageRecords };
}
