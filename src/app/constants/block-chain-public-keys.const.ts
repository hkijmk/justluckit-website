import { PublicKey } from '@solana/web3.js';

const HOST_KEYS = [
    new PublicKey('H2LjtpQJ9WdYEghsWxtcUKpXSeUUuBeGmfY5H12mpp7F'),
    new PublicKey('qqVD8yq8u1NxnxfeyP8NTvPJ5sRqDPHREhoKt7oWTUA'),
    new PublicKey('4KRCc9fiQo7KPFP3YLDU8ZwafLUUhDquX9kUeeg8c1iV'),
    new PublicKey('Dh6zn2So73rdb9kJQmFTjHs3xe3u2rCSCoxKv5uV71pj'),
    new PublicKey('9rNMX1Ncc5K1u63cGamsKLC6BpfQ7HB4g3HF8YPHquKa'),
    new PublicKey('G7n1eoCUVos7gnmjVyvqeo44TGjcrqDRYMzm96HB2pYh'),
    new PublicKey('EV6UapKrMNEWQKdYUzLsUF6EiEkth2xV8wRCinxpXvBV'),
    new PublicKey('B7isLhK11xEEcer4t8H4wTyAhBoMTet3gNpxRWNPs3Nt'),
    new PublicKey('3uyocncf7svzUJba7S5mEwjxHGJ3GY948W1Vr86h2J1Y'),
    new PublicKey('BMNs8tb2ycJN1SQNzBzk1REUszupwjn3YooU918oZcsE'),
];

export const BLOCK_CHAIN_KEYS = {
    hosts: HOST_KEYS,
    programId: new PublicKey('6UA8U5SHkuUWGeqc9mnFeby6TTCACvTSACwQo4fuhDH'),
    term: new PublicKey('4LmheLVizuRFpw64F1TXnjML8wevLzvvTyKYTbSZsA5b'),
    record: new PublicKey('3HY8Tu7UYMqSnnhXEHe9mmrUds5wEZWs4q6YAubyPPFE'),
}
