import React from 'react';
import Link from '@docusaurus/Link';
import {findFirstCategoryLink, useDocById} from '@docusaurus/theme-common';
import clsx from 'clsx';
import styles from './styles.module.css';
import isInternalUrl from '@docusaurus/isInternalUrl';
import {translate} from '@docusaurus/Translate';

function CardContainer({href, children}) {
  return (
    <Link
      href={href}
      className={clsx('card padding--lg', styles.cardContainer)}>
      {children}
    </Link>
  );
}

function CardLayout({href, icon, title, description}) {
  return (
    <CardContainer href={href}>
      <h2 className={clsx('text--truncate', styles.cardTitle)} title={title}>
        {icon} {title}
      </h2>
      {description && (
        <p
          className={clsx('text--truncate', styles.cardDescription)}
          title={description}>
          {description}
        </p>
      )}
    </CardContainer>
  );
}

function CardCategory({ item }) {
  const doc = useDocById(item.docId ?? undefined);
  const href = findFirstCategoryLink(item); // Unexpected: categories that don't have a link have been filtered upfront

  if (!href) {
    return null;
  }

  return (
    <CardLayout
      href={href}
      icon=""
      title={item.label}
      description={item.description}
    />
  );
}

function CardLink({item}) {
  const doc = useDocById(item.docId ?? undefined);
  const icon = "";
  return (
    <CardLayout
      href={item.href}
      icon={icon}
      title={item.label}
      description={doc?.description}
    />
  );
}

export default function DocCard({item}) {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;

    case 'category':
      return <CardCategory item={item} />;

    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
