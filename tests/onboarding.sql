begin;
do $$declare u uuid:=gen_random_uuid();begin
 insert into auth.users(id,email,email_confirmed_at) values(u,'alias-test@example.invalid',now());
 insert into anonymous.profiles(user_id,display_name,alias,active) values(u,'Demo','',true);
 insert into anonymous.app_access(email,user_id,status) values('alias-test@example.invalid',u,'pending');
 perform set_config('request.jwt.claim.sub',u::text,true);
 perform set_config('request.jwt.claims',json_build_object('sub',u,'email','alias-test@example.invalid','role','authenticated')::text,true);
end$$;
set local role authenticated;
select anonymous.visit();
update anonymous.profiles set alias='Alias inițial' where user_id=auth.uid();
update anonymous.profiles set alias='Alias modificat' where user_id=auth.uid();
do $$declare changed int;begin
 if not exists(select 1 from anonymous.profiles where user_id=auth.uid() and alias='Alias modificat') then raise exception 'Alias update failed';end if;
 update anonymous.profiles set alias='Foreign' where user_id<>auth.uid();
 get diagnostics changed=row_count;
 if changed<>0 then raise exception 'Foreign profile update allowed';end if;
end$$;
reset role;rollback;
select 'PASS Anonymous: first visit, first alias, alias update and isolation; rolled back' as result;