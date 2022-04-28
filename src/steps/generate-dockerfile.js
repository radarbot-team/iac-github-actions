const fs = require('fs')
const path = require('path')
const Template = require("../template");

const stub = `
# This file was autogenerated at {{generatedAt}}.
FROM {{image}}:{{tag}}
MAINTAINER {{maintainer}}

LABEL {{labels}}
ENV {{environemntVariables}}

WORKDIR /app
COPY . /app

RUN {{dependencyCommand}}

ENTRYPOINT ["{{entrypoint}}"]
CMD ["{{command}}"]
`;

module.exports = function (params, writeFile = true) {
  console.log({ params })

  const {
    image,
    tag,
    maintainer,
    labels = [],
    environemntVariables = [ 'TZ=GMT', 'ENV=development' ],
    generatedAt = new Date().toISOString(),
    dependencyCommand,
    entrypoint,
    command,
  } = params;

  const template = new Template({ stub });

  const content = template.render({
    generatedAt,
    image,
    tag,
    maintainer,
    labels: [
      `builtAt=${new Date().toISOString().substring(0, 10)}`,
    ].concat(labels).join(' \\\n\t'),
    environemntVariables: [].concat(environemntVariables).join(' \\\n\t'),
    dependencyCommand,
    entrypoint,
    command,
  })

  console.log(content)
  
  if (writeFile) {
    fs.writeFileSync(path.join(process.cwd(), 'Dockerfile'), content)
  }

  return content
}
