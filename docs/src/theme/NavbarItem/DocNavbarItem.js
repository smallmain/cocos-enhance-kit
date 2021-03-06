import React from 'react';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import {useActiveDocContext} from '@docusaurus/plugin-content-docs/client';
import clsx from 'clsx';
import {getInfimaActiveClassName} from '@theme/NavbarItem/utils';
import {useLayoutDoc} from '@docusaurus/theme-common';
export default function DocNavbarItem({
  docId,
  label: staticLabel,
  docsPluginId,
  ...props
}) {
  const {activeDoc} = useActiveDocContext(docsPluginId);
  const doc = useLayoutDoc(docId, docsPluginId); // Draft items are not displayed in the navbar.

  if (doc === null) {
    return null;
  }

  const activeDocInfimaClassName = getInfimaActiveClassName(props.mobile);
  return (
    <DefaultNavbarItem
      exact
      {...props}
      className={clsx(props.className, {
        // Do not make the item active if the active doc doesn't have sidebar.
        [activeDocInfimaClassName]:
          // If `activeDoc === doc` react-router will make it active anyways,
          // regardless of the existence of a sidebar
          activeDoc?.sidebar && activeDoc.sidebar === doc.sidebar,
      })}
      activeClassName={activeDocInfimaClassName}
      label={staticLabel ?? doc.id}
      to={doc.path}
    />
  );
}
