import fs from 'fs';

const sendVideoById = (id, connection) => {
  fs.readFile(`./${id}.mp4`, (err, data) => {
    if (err) throw err;
    connection.sendBytes(data);
  });
};

export default (data, connection) => {
  let sentArr;
  switch (data.type) {
    case 'utf8':
      sentArr = data.utf8Data.split(':');

      switch (sentArr[0]) {
        case 'START':
          sendVideoById(sentArr[1], connection);
          break;

        default:
          throw Error('Unexpected UTF8 signatured command');
      }
      break;

    default:
      throw Error('Unexpected dataType');
  }
};
