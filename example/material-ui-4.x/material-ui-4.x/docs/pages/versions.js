import React from 'react';
import sortedUniqBy from 'lodash/sortedUniqBy';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import fetch from 'cross-fetch';
import { prepareMarkdown } from 'docs/src/modules/utils/parseMarkdown';

const pageFilename = 'versions';
const requireDemo = require.context('docs/src/pages/versions/', false, /\.(js|tsx)$/);
const requireRaw = require.context('!raw-loader!../src/pages/versions', false, /\.(js|md|tsx)$/);

export default function Page({ demos, docs }) {
  return <MarkdownDocs demos={demos} docs={docs} requireDemo={requireDemo} />;
}

function formatVersion(version) {
  return version
    .replace('v', '')
    .split('.')
    .map((n) => +n + 1000)
    .join('.');
}

async function getBranches() {
  const githubAuthorizationToken = process.env.GITHUB_AUTH || '';

  const result = await fetch('https://api.github.com/repos/mui-org/material-ui-docs/branches', {
    headers: {
      Authorization: `Basic ${Buffer.from(githubAuthorizationToken).toString('base64')}`,
    },
  });
  const branches = await result.json();
  return branches;
}

Page.getInitialProps = async () => {
  const FILTERED_BRANCHES = ['latest', 'l10n', 'next'];

  const branches = await getBranches();
  let versions = branches.map((branch) => branch.name);
  versions = versions.filter((value) => FILTERED_BRANCHES.indexOf(value) === -1);
  versions = versions.map((version) => ({
    version,
    // Replace dot with dashes for Netlify branch subdomains
    url: `https://${version.replace(/\./g, '-')}.material-ui.com`,
  }));
  // Current version.
  versions.push({
    version: `v${process.env.LIB_VERSION}`,
    url: 'https://mui.com',
  });
  // Legacy documentation.
  versions.push({
    version: 'v0',
    url: 'https://v0.mui.com',
  });
  versions = versions.sort((a, b) =>
    formatVersion(b.version).localeCompare(formatVersion(a.version)),
  );

  if (
    branches.find((branch) => branch.name === 'next') &&
    !versions.find((version) => /beta|alpha/.test(version.version))
  ) {
    versions.unshift({
      version: `v${Number(versions[0].version[1]) + 1} pre-release`,
      url: 'https://next.mui.com',
    });
  }

  versions = sortedUniqBy(versions, 'version');

  const { demos, docs } = prepareMarkdown({ pageFilename, requireRaw });

  return { demos, docs, versions };
};
