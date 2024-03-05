type ReferenceType = 'transaction' | 'transfer' | 'credit' | 'card' | 'crypto' | 'account';

export default function generateReference(type: ReferenceType): string {
  if (type === 'transaction') return `myWALLT-TRANS-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  else if (type === 'transfer') return `myWALLT-TRANSF-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  else if (type === 'credit') return `myWALLT-CRED-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  else if (type === 'card') return `myWALLT-CARD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  else if (type === 'crypto') return `myWALLT-CRYPTO-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  else if (type === 'account') return `ACCOUNT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  else throw new Error('Invalid type');
}
