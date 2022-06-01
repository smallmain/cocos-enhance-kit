import React from 'react';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import {useActiveDocContext} from '@docusaurus/plugin-content-docs/client';
import clsx from 'clsx';
import {getInfimaActiveClassName} from '@theme/NavbarItem/utils';
import {useLayoutDocsSidebar} from '@docusaurus/theme-common';
export default function DocSidebarNavbarItem({
  sidebarId,
  label,
  docsPluginId,
  ...props
}) {
  const {activeDoc} = useActiveDocContext(docsPluginId);
  const sidebarLink = useLayoutDocsSidebar(sidebarId, docsPluginId).link;

  if (!sidebarLink) {
    throw new Error(
      `DocSidebarNavbarItem: Sidebar with ID "${sidebarId}" doesn't have anything to be linked to.`,
    );
  }

  const activeDocInfimaClassName = getInfimaActiveClassName(props.mobile);
  return (
    <DefaultNavbarItem
      exact
      {...props}
      className={clsx(props.className, {
        [activeDocInfimaClassName]: activeDoc?.sidebar === sidebarId,
      })}
      activeClassName={activeDocInfimaClassName}
      label={label ?? sidebarLink.label}
      to={sidebarLink.path}
    />
  );
}
