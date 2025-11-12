'use client';

import { getInitials } from '@/core/auth/utils';
import { UserDto } from '@/domains/administrative-proceedings/api/services/getAdminProcesses';

import styles from './ResponsibleUsers.module.css';

interface ResponsibleUsersProps {
  users: UserDto[];
}

const AvatarsNumber = 2;

const ResponsibleUsers = (props: ResponsibleUsersProps) => {
  const { users } = props;
  const userNames = users
    .slice(0, AvatarsNumber)
    .map((user) => user.name)
    .join(', ');

  return (
    <div className={styles.container}>
      <div>
        {users.length > AvatarsNumber ? (
          <>
            {users.slice(0, AvatarsNumber).map((user) => (
              <span key={user.id} className={styles.avatar}>
                {getInitials(user.name || '')}
              </span>
            ))}
            <span className={styles.avatarsCounter}>+{users.length - AvatarsNumber}</span>
          </>
        ) : (
          users.map((user) => (
            <span key={user.id} className={styles.avatar}>
              {getInitials(user.name || '')}
            </span>
          ))
        )}
      </div>
      <div className={styles.responsibleUsers} title={userNames}>
        {userNames}
      </div>
    </div>
  );
};

export default ResponsibleUsers;
