import React from 'react';
import ComponentTypes from '@theme/NavbarItem/ComponentTypes';

const getNavbarItemComponent = (type) => {
  const component = ComponentTypes[type];

  if (!component) {
    throw new Error(`No NavbarItem component found for type "${type}".`);
  }

  return component;
};

function getComponentType(type, isDropdown) {
  // Backward compatibility: navbar item with no type set
  // but containing dropdown items should use the type "dropdown"
  if (!type || type === 'default') {
    return isDropdown ? 'dropdown' : 'default';
  }

  return type;
}

export default function NavbarItem({type, ...props}) {
  const componentType = getComponentType(type, props.items !== undefined);
  const NavbarItemComponent = getNavbarItemComponent(componentType);
  return <NavbarItemComponent {...props} />;
}
