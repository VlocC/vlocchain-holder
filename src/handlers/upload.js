import fs from 'fs';

export default (data, uploadInformation) => {
  let sentArr;
  switch (data.type) {
    case 'utf8':
      sentArr = data.utf8Data.split(':');
      switch (sentArr[0]) {
        case 'START':
          uploadInformation.videoArr = new Uint8Array(parseInt(sentArr[1], 10));
          uploadInformation.index = 0;
          break;

        case 'END':
          fs.writeFile(`./${sentArr[1]}.${sentArr[2]}`, uploadInformation.videoArr, (err) => {
            if (err) {
              console.log(err);
            }
            console.log('The file was saved!');
          });
          break;

        default:
          throw Error('Unexpected UTF8 signatured command');
      }
      break;

    case 'binary':
      sentArr = new Int16Array(data.binaryData);
      for (let i = 0; i < sentArr.length; i += 1) {
        uploadInformation.videoArr[i + uploadInformation.index] = sentArr[i];
      }
      uploadInformation.index += sentArr.length;
      break;

    default:
      throw Error('Unexpected dataType');
  }
};
