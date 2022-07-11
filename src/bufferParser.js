const splitFields = (buffer, boundary) => {
  const fields = [];
  let remaining = buffer;
  for (let index = 0; index < buffer.length; index++) {
    const slice = buffer.slice(index, index + boundary.length)
    if (slice.equals(boundary)) {
      const part = remaining.slice(0, index);
      fields.push(part);
      remaining = buffer.slice(index + boundary.length);
    }
  }
  return fields;
};

const parseAttributes = rawAttributes => {
  if (!rawAttributes) {
    return;
  }
  const attributes = {};

  rawAttributes.forEach(attribute => {
    const [key, value] = attribute.split('=');
    attributes[key.trim()] = value.trim().slice(1, -1);
  })
  return attributes;
};

const parseHeader = (header) => {
  const parsedHeader = {};
  header.split('\r\n').forEach(line => {
    if (!line) {
      return;
    }
    const [header, values] = line.split(':');
    const [value, ...rawAttributes] = values.split(';');
    const attributes = parseAttributes(rawAttributes);
    parsedHeader[header.toLowerCase()] = { value: value.trim(), attributes }
  });
  return parsedHeader;
};

const splitField = field => {
  for (let index = 0; index < field.length; index++) {
    const slice = field.slice(index, index + 4);
    const CRLF = Buffer.from('\r\n\r\n')
    if (slice.equals(CRLF)) {
      const header = parseHeader(field.slice(0, index).toString());
      const content = field.slice(index + 4, -1)
      return { header, content }
    }
  }
};

const parseBody = (fields) => {
  const bodyParams = [];
  fields.forEach(field => {
    if (field.length === 0) {
      return;
    }
    bodyParams.push(splitField(field))
  })
  return bodyParams;
};

const parseBuffer = (buffer, boundary) => {
  const fields = splitFields(buffer, boundary);
  const parsedBody = parseBody(fields);
  return parsedBody;
};

module.exports = { parseBuffer };
