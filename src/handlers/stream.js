import fs from 'fs';
import { execSync } from 'child_process';

const sendVideoById = (id, codec, connection) => {
  if (fs.existsSync(`./${id}.mp4`)) {
    console.log('Sending up file');
    fs.readFile(`./${id}.mp4`, (err, data) => {
      if (err) throw err;
      connection.sendBytes(data);
    });
  }
};

const getVideoCodecs = (id) => {
  console.log('getting codecs');

  const output = execSync(`mp4info ${id}.mp4 | grep Codecs`).toString('utf8').trim();
  console.log(typeof output);
  const codecs = output.split('Codecs String: ').reduce((acc, curr) => {
    if (curr !== '' && curr !== null) {
      return !acc ? curr : `${acc.trim()}, ${curr.trim()}`;
    }
    return acc;
  });

  return `video/mp4; codecs="${codecs}"`;
};

export default (data, connection) => {
  let sentArr;
  let codec;
  switch (data.type) {
    case 'utf8':
      sentArr = data.utf8Data.split(':');

      switch (sentArr[0]) {
        case 'START':
          connection.sendUTF(getVideoCodecs(sentArr[1]));
          sendVideoById(sentArr[1], codec, connection);
          break;

        default:
          throw Error('Unexpected UTF8 signatured command');
      }
      break;

    default:
      throw Error('Unexpected dataType');
  }
};
