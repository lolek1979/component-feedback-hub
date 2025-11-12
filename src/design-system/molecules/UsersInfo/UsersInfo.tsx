import { Avatar, Text } from '@/design-system/atoms';

import styles from './UsersInfo.module.css';

/**
 * Represents a user/person for display in UsersInfo.
 *
 * @property abbrev - Abbreviation or initials of the user.
 * @property fullName - Full name of the user.
 * @property mail - Email address of the user.
 * @property department - Department or organization unit.
 * @property businessPhones - Array of business phone numbers.
 */
export interface Person {
  abbrev: string;
  fullName: string;
  mail: string;
  department: string;
  businessPhones: string[];
}

/**
 * Props for the UsersInfo component.
 *
 * @property title - Optional title to display above the user list.
 * @property users - Array of Person objects to display.
 * @property className - Optional additional CSS class.
 */
interface UsersInfoProps {
  title?: string;
  users: Person[];
  className?: string;
}

/**
 * UsersInfo component for displaying a list of users with avatars and contact details.
 *
 * Renders user name, phones, department, and email in a styled list.
 *
 * @param props UsersInfoProps
 * @returns React component
 */
export const UsersInfo = ({ title, users, className }: UsersInfoProps) => {
  return (
    <div
      className={`${styles.container} ${className || ''}`}
      role="region"
      aria-label="User Information"
    >
      <Text variant="subtitle">{title}</Text>
      <ul className={styles.list} role="list">
        {users.map((user) => (
          <li key={user.mail} className={styles.item} role="listitem">
            <Avatar name={user.fullName} />
            <div className={styles.info}>
              <Text variant="subtitle" regular className={styles.fullname}>
                {user.fullName}
              </Text>
              <Text variant="caption" regular className={styles.contact}>
                {user.businessPhones.join(', ')}
              </Text>
              <Text variant="caption" regular className={styles.contact}>
                {user.department}
              </Text>
              <Text variant="caption" regular className={styles.contact}>
                {user.mail}
              </Text>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
