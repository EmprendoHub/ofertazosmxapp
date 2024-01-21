import React from 'react';

const ReferralLinkList = ({ referralLinks }) => {
  return (
    <div>
      <h2>Referral Links</h2>
      <ul>
        {referralLinks?.map((link) => (
          <li key={link._id}>{link.uniqueCode}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReferralLinkList;
