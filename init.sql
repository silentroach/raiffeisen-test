create table accounts (
    account_id bigserial primary key,
    balance decimal(12, 0) check (balance > 0)
);

insert into accounts (account_id, balance)
values (1, 5000000), (2, 2500000), (3, 10000000)