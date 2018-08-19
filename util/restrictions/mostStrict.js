export default function MostStrict() {
  return {
    types: {
      account: [
        'id',
        'first_name',
        'last_name',
        'last_active_date',
        'signup_date',
      ],
      forum: [
        'id',
        'account_id',
        'signup_date',
        'last_active_date',
        'post_replied',
        'post_created',
      ],
    },
    roles: {
      basic: ['id', 'last_active_date', 'signup_date'],
    },
  };
}
