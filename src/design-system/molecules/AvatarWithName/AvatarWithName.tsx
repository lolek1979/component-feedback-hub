'use client';

import clsx from 'clsx';

import { Avatar, Text } from '@/design-system/atoms';

import styles from './AvatarWithName.module.css';

interface AvatarWithNameProps {
  name: string;
  displayNameOnly?: boolean;
  phone?: string;
  size?: 'S' | 'M' | 'L';
}

/**
 * UserAvatarWithName component displays a user's avatar along with their name, organization, and email.
 * If displayNameOnly param is true, it only displays the name.
 * If the input string does not match the expected format (Mahulena Nahulena Bc. (VZP ČR Ústředí), mahulena.nahulena@vzp.cz), it returns a single dash '-'.
 *
 * @param {AvatarWithNameProps} props - The properties for the UserAvatarWithName component.
 * @param {string} [props.name] - Input string containing the user's name, organization, and email.
 * @param {boolean} [props.displayNameOnly=false] - If true, only the name is displayed.
 * @returns
 */
export const AvatarWithName: React.FC<AvatarWithNameProps> = ({
  name,
  displayNameOnly = false,
  phone,
  size = 'L',
}) => {
  /**
   * The component renders a container with the user's avatar and name.
   * It is expected that input string is in format 'Pepa Zdepa Bc. (VZP ČR Ústředí), pepa.zdepa@vzp.cz'
   * This function parses the input string to extract the user's name, organization, and email.
   * If the input string does not match the expected format, it returns a single dash '-'.
   *
   * @param input - Input string containing the user's name, organization, and email.
   * @returns
   */
  function parseDisplayName(input: string): string[] {
    const nameMatch = input.match(/^([^()]+?)(?=\s*\(|,|$)/);
    const orgMatch = input.match(/\(([^)]+)\)/);
    const emailMatch = input.match(/[\w.-]+@[\w.-]+\.\w+/);

    const name = nameMatch?.[1]?.trim();
    const org = orgMatch ? `(${orgMatch[1]})` : null;
    const email = emailMatch?.[0];

    if (!name || (!org && !email)) {
      return ['-'];
    }

    const result = [name, org].filter(Boolean) as string[];

    if (phone) {
      result.push(phone);
    }

    if (email) {
      result.push(email);
    }

    return result;
  }

  const parsedName = parseDisplayName(name);

  /**
   * The component renders a container with the user's avatar and name.
   */
  const sizeClass = size === 'S' ? styles.sizeS : size === 'M' ? styles.sizeM : styles.sizeL;
  const containerClasses = clsx(styles.container, sizeClass);
  const textVariant = size === 'S' ? 'caption' : size === 'M' ? 'footnote' : 'subtitle';
  const showOnlyName = size === 'S' || size === 'M';

  return (
    <div className={containerClasses}>
      {parsedName.length > 1 && <Avatar name={parsedName[0]} size={size} />}
      {(displayNameOnly || showOnlyName) && parsedName.length >= 1 && (
        <Text variant="subtitle" regular>
          {parsedName[0]}
        </Text>
      )}
      {!displayNameOnly && !showOnlyName && parsedName.length > 0 && (
        <div className={styles.multiLine}>
          {parsedName.map((element, index) => (
            <Text
              key={`key-element-${index}`}
              id={`id-element-${index}`}
              className={styles.line}
              variant={index === 0 ? 'subtitle' : textVariant}
              color={index === 0 ? 'primary' : 'tertiary'}
              regular
            >
              {element}
            </Text>
          ))}
        </div>
      )}
    </div>
  );
};
