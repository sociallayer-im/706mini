# 实际存储结构与字段用途

24类业务/内部JSON记录共享 `community706.data`；`$users`、`$files` 各有SQL表。原26类记录不等于26张物理表。另列10张runtime支撑表的源码设计。

逐字段约束、读写用途、关系与精确源码证据：[storage-catalog.json](storage-catalog.json)。原81接口索引保持不变。

## 结构确认范围

- 前次26种记录=24种community706.type逻辑JSON记录+$users/$files两个系统实体，不是26张物理SQL表。另列10张相关runtime支持表设计，不表示已逐张确认当前库。
- Montana.Schema.Migrator:153/180与DDL:22明确etype→SQL表、blob→column；nil checked type→jsonb。客户端triples仅协议/同步格式，不是EAV triples落库。
- physicalStorage共13个源码/历史SQL载体设计：3 tenant表+10 runtime表。租户schema使用app.pg_schema，默认Naming app_<lowercase appId>；system默认montana。当前实际生产pg_schema/表名未查询。
- 历史预v6 schema元数据：community706 id唯一索引；type/owner/parent/status/created_at index?=false；deploy.py计划补这些索引。当前pg_index未查，不能把部署意图当实际索引。
- 根属性schema有string/number类型；data为JSONB无独立子字段schema。required区分operation显式校验与SQL NOT NULL；草稿允许不完整、submit/review再校验，不以页面必填代替数据库约束。
- owner/parent及data ID数组是应用文本关系，未声明attrs ref/SQL FK。runtime迁移app_id FK明确单独标示。
- get/rows data展开后用根column metadata覆盖；save spread old→put只解构owner/parent/status，其余元数据可能保留在data副本；根字段为权威。unknown线上历史JSON未读取，不宣称穷举。
- decrypted.*只说明AES-GCM解密结构，明文不另存SQL；不读取或输出实际联系方式/openid/token/env值。
- featured_entities/membership当前只读，profile公开write不接受featured_entities，membership无写op。approved_at/recommendation_id/actor_id为历史/可选读取，当前生成函数不赋值。
- $users.status被active读取，但历史schema与系统声明未含，是否后台扩展未知。$files大小/MIME/location由Storage ensure attrs动态补充；旧schema未含不代表当前不存在。
- 文件bytes存S3对象；$files为SQL元数据，media为community706业务引用，私有HMAC能力/ACL为业务层；$files.url动态计算不等于长期公开URL。
- guard/command/后台操作记录/payment/审核历史/微信加密身份/内部到期任务/function_env/部署日志都保留用途，不能因无用户页面而判定未使用。cron仅runtime能力，community未注册。
- 运行时通用OAuth/rooms/queues/streams/backups非此模块显式业务接入，不扩成整个Montana数据库；其他迁移可再扩展所列SQL表，本清单标相关字段范围。
- 零runtime/API/数据库请求，未测试编译GUI截图部署或改业务；原81接口索引不改。
- id字段SQL PRIMARY KEY ⇒ databaseNotNull=true；历史attr declarationRequired=false单独记录，不表示id可空。upload_urls.replace来自后续migration与Storage.create/consume_upload_url实际读写；signed-upload请求就创建此内部能力，不等待media登记。

## SQL载体设计

| 名称 | 来源确认程度 | 字段 |
| --- | --- | --- |
| <app.pg_schema>."community706" | 历史schema与源码DDL确认设计；当前运行未查 | created_at, data, id, owner, parent, status, type, updated_at, version |
| <app.pg_schema>."$users" | 历史schema与源码DDL确认设计；当前运行未查 | email, id, imageURL, phone, type |
| <app.pg_schema>."$files" | 历史schema与源码DDL确认设计；当前运行未查 | cache-control, id, metadata, path, url, size, content-type, content-disposition, location-id |
| <Naming.system_schema>.apps | SQL migration源码确认；默认montana schema；当前生产migration/catalog未读 | id, title, pg_schema, admin_token_hash, inserted_at, updated_at, schema_version, db_role |
| <Naming.system_schema>.attrs | SQL migration源码确认；默认montana schema；当前生产migration/catalog未读 | id, app_id, fwd_ident_id, fwd_etype, fwd_label, rev_ident_id, rev_etype, rev_label, value_type, cardinality, is_unique, is_indexed, is_required, checked_data_type, on_delete, on_delete_reverse, catalog, storage, table_name, column_name, inserted_at, updated_at, search_indexed, vector_dimensions, column_type |
| <Naming.system_schema>.refresh_tokens | SQL migration源码确认；默认montana schema；当前生产migration/catalog未读 | token_hash, app_id, user_id, inserted_at |
| <Naming.system_schema>.magic_codes | SQL migration源码确认；默认montana schema；当前生产migration/catalog未读 | app_id, recipient, code_hash, expires_at, attempts, consumed, inserted_at, id |
| <Naming.system_schema>.upload_urls | SQL migration源码确认；默认montana schema；当前生产migration/catalog未读 | id, app_id, path, expires_at, replace |
| <Naming.system_schema>.function_deployments | SQL migration源码确认；默认montana schema；当前生产migration/catalog未读 | app_id, version, code, manifest, inserted_at |
| <Naming.system_schema>.function_env | SQL migration源码确认；默认montana schema；当前生产migration/catalog未读 | app_id, name, value, updated_at |
| <Naming.system_schema>.function_logs | SQL migration源码确认；默认montana schema；当前生产migration/catalog未读 | app_id, name, kind, ok, error, duration_ms, logs, inserted_at, id |
| <Naming.system_schema>.scheduled_jobs | SQL migration源码确认；默认montana schema；当前生产migration/catalog未读 | id, app_id, cron_name, action, run_at, state, error, result, started_at, completed_at, inserted_at |
| <Naming.system_schema>.cron_jobs | SQL migration源码确认；默认montana schema；当前生产migration/catalog未读 | app_id, name, schedule, action, next_run_at, last_run_at, inserted_at, updated_at |

## 按存储记录列出字段

### profile · 成员资料

community706_json_record → physical:community706。公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；id | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；type | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；owner | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；parent | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；status | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；data | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；version | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；created_at | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；updated_at | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| data.display_name | string | 传入时非空；data子字段无DB类型/NOT NULL；仅operation显式校验 | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；display_name | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| data.avatar_url | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；avatar_url | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| data.bio | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；bio | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| data.introduction | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；introduction | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| data.city | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；city | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| data.interests | string[] | 传入时2–5项；data子字段无DB类型/NOT NULL；仅operation显式校验 | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；interests | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| data.public_links | array(any),无严格shape | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；public_links | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| data.frequent_spaces | id[] | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；frequent_spaces | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| data.featured_entities | id[] | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；featured_entities | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| data.locale | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；locale | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| data.notification_preferences | object | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；notification_preferences | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| data.visibility | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；visibility | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| data.share_activity | boolean | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；share_activity | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| data.onboarded | boolean | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；onboarded | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| data.consent_version | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；consent_version | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |
| data.consented_at | ISO string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 公开资料与本人设置；share_activity控制公开参与；featured_entities既有读取优先于frequent_spaces，当前profile写入不接受featured_entities；consented_at | 读：read.me, read.member, read.people, read.feed, read.search, read.event, read.entity, read.relations, read.attendees；写：write.profile |

关系：owner → $users.id; data.frequent_spaces → entity.id[]; data.featured_entities → entity.id[]。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### contact · 私有联系方式

community706_json_record → physical:community706。本人联系方式与授权报名联系信息；AES-GCM加密，不进入公开profile/幂等缓存

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | 本人联系方式与授权报名联系信息；AES-GCM加密，不进入公开profile/幂等缓存；id | 读：read.selfContact, write.registrationContact；写：write.profile |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 本人联系方式与授权报名联系信息；AES-GCM加密，不进入公开profile/幂等缓存；type | 读：read.selfContact, write.registrationContact；写：write.profile |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 本人联系方式与授权报名联系信息；AES-GCM加密，不进入公开profile/幂等缓存；owner | 读：read.selfContact, write.registrationContact；写：write.profile |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 本人联系方式与授权报名联系信息；AES-GCM加密，不进入公开profile/幂等缓存；parent | 读：read.selfContact, write.registrationContact；写：write.profile |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 本人联系方式与授权报名联系信息；AES-GCM加密，不进入公开profile/幂等缓存；status | 读：read.selfContact, write.registrationContact；写：write.profile |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 本人联系方式与授权报名联系信息；AES-GCM加密，不进入公开profile/幂等缓存；data | 读：read.selfContact, write.registrationContact；写：write.profile |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 本人联系方式与授权报名联系信息；AES-GCM加密，不进入公开profile/幂等缓存；version | 读：read.selfContact, write.registrationContact；写：write.profile |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 本人联系方式与授权报名联系信息；AES-GCM加密，不进入公开profile/幂等缓存；created_at | 读：read.selfContact, write.registrationContact；写：write.profile |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 本人联系方式与授权报名联系信息；AES-GCM加密，不进入公开profile/幂等缓存；updated_at | 读：read.selfContact, write.registrationContact；写：write.profile |
| data.encrypted | {iv,cipher}AES-GCM | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 本人联系方式与授权报名联系信息；AES-GCM加密，不进入公开profile/幂等缓存；encrypted | 读：read.selfContact, write.registrationContact；写：write.profile |
| data.encrypted.iv | base64 string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 本人联系方式与授权报名联系信息；AES-GCM加密，不进入公开profile/幂等缓存；encrypted.iv | 读：read.selfContact, write.registrationContact；写：write.profile |
| data.encrypted.cipher | base64 string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 本人联系方式与授权报名联系信息；AES-GCM加密，不进入公开profile/幂等缓存；encrypted.cipher | 读：read.selfContact, write.registrationContact；写：write.profile |
| decrypted.wechat | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 本人联系方式与授权报名联系信息；AES-GCM加密，不进入公开profile/幂等缓存；decrypted.wechat | 读：read.selfContact, write.registrationContact；写：仅加密blob写入；无独立明文列 |

关系：owner → $users.id。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### entity · 空间与组织

community706_json_record → physical:community706。SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；id | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；type | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；owner | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；parent | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；status | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；data | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；version | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；created_at | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；updated_at | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| data.kind | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；kind | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| data.name | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；name | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| data.city | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；city | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| data.introduction | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；introduction | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| data.address | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；address | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| data.opening_hours | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；opening_hours | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| data.public_contact | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；public_contact | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| data.public_links | array(any),无严格shape | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；public_links | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| data.cover_url | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；cover_url | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| data.avatar_url | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；avatar_url | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |
| data.allow_event_requests | boolean | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | SPACE/ORGANIZATION共享type；公开主页/活动发起与场地；创建与OWNER由operator确认；allow_event_requests | 读：read.entities, read.entity, read.member, read.people, read.events, read.event, read.search, read.managed, read.admins；写：write.entity, operator.initialConfiguration |

关系：owner → $users.id(初始化)。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### role · 管理权限

community706_json_record → physical:community706。ENTITY OWNER/ADMIN、PLATFORM管理权限，实时重读；membership不授予管理权限

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | ENTITY OWNER/ADMIN、PLATFORM管理权限，实时重读；membership不授予管理权限；id | 读：read.me, read.managed, read.admins, read.reviews, read.review, helper.platform, helper.manages, helper.canEdit；写：write.acceptInvite, write.revokeRole, operator.initialConfiguration |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | ENTITY OWNER/ADMIN、PLATFORM管理权限，实时重读；membership不授予管理权限；type | 读：read.me, read.managed, read.admins, read.reviews, read.review, helper.platform, helper.manages, helper.canEdit；写：write.acceptInvite, write.revokeRole, operator.initialConfiguration |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | ENTITY OWNER/ADMIN、PLATFORM管理权限，实时重读；membership不授予管理权限；owner | 读：read.me, read.managed, read.admins, read.reviews, read.review, helper.platform, helper.manages, helper.canEdit；写：write.acceptInvite, write.revokeRole, operator.initialConfiguration |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | ENTITY OWNER/ADMIN、PLATFORM管理权限，实时重读；membership不授予管理权限；parent | 读：read.me, read.managed, read.admins, read.reviews, read.review, helper.platform, helper.manages, helper.canEdit；写：write.acceptInvite, write.revokeRole, operator.initialConfiguration |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | ENTITY OWNER/ADMIN、PLATFORM管理权限，实时重读；membership不授予管理权限；status | 读：read.me, read.managed, read.admins, read.reviews, read.review, helper.platform, helper.manages, helper.canEdit；写：write.acceptInvite, write.revokeRole, operator.initialConfiguration |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | ENTITY OWNER/ADMIN、PLATFORM管理权限，实时重读；membership不授予管理权限；data | 读：read.me, read.managed, read.admins, read.reviews, read.review, helper.platform, helper.manages, helper.canEdit；写：write.acceptInvite, write.revokeRole, operator.initialConfiguration |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | ENTITY OWNER/ADMIN、PLATFORM管理权限，实时重读；membership不授予管理权限；version | 读：read.me, read.managed, read.admins, read.reviews, read.review, helper.platform, helper.manages, helper.canEdit；写：write.acceptInvite, write.revokeRole, operator.initialConfiguration |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | ENTITY OWNER/ADMIN、PLATFORM管理权限，实时重读；membership不授予管理权限；created_at | 读：read.me, read.managed, read.admins, read.reviews, read.review, helper.platform, helper.manages, helper.canEdit；写：write.acceptInvite, write.revokeRole, operator.initialConfiguration |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | ENTITY OWNER/ADMIN、PLATFORM管理权限，实时重读；membership不授予管理权限；updated_at | 读：read.me, read.managed, read.admins, read.reviews, read.review, helper.platform, helper.manages, helper.canEdit；写：write.acceptInvite, write.revokeRole, operator.initialConfiguration |
| data.scope | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | ENTITY OWNER/ADMIN、PLATFORM管理权限，实时重读；membership不授予管理权限；scope | 读：read.me, read.managed, read.admins, read.reviews, read.review, helper.platform, helper.manages, helper.canEdit；写：write.acceptInvite, write.revokeRole, operator.initialConfiguration |
| data.role | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | ENTITY OWNER/ADMIN、PLATFORM管理权限，实时重读；membership不授予管理权限；role | 读：read.me, read.managed, read.admins, read.reviews, read.review, helper.platform, helper.manages, helper.canEdit；写：write.acceptInvite, write.revokeRole, operator.initialConfiguration |

关系：owner → $users.id; parent → entity.id；PLATFORM可空。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### membership · 组织成员

community706_json_record → physical:community706。组织成员标签/贡献；既有记录读取；无当前模块写入op

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | 组织成员标签/贡献；既有记录读取；无当前模块写入op；id | 读：read.member, helper.memberEntities；写：无当前模块写入op；既有或Mock数据 |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 组织成员标签/贡献；既有记录读取；无当前模块写入op；type | 读：read.member, helper.memberEntities；写：无当前模块写入op；既有或Mock数据 |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 组织成员标签/贡献；既有记录读取；无当前模块写入op；owner | 读：read.member, helper.memberEntities；写：无当前模块写入op；既有或Mock数据 |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 组织成员标签/贡献；既有记录读取；无当前模块写入op；parent | 读：read.member, helper.memberEntities；写：无当前模块写入op；既有或Mock数据 |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 组织成员标签/贡献；既有记录读取；无当前模块写入op；status | 读：read.member, helper.memberEntities；写：无当前模块写入op；既有或Mock数据 |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 组织成员标签/贡献；既有记录读取；无当前模块写入op；data | 读：read.member, helper.memberEntities；写：无当前模块写入op；既有或Mock数据 |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 组织成员标签/贡献；既有记录读取；无当前模块写入op；version | 读：read.member, helper.memberEntities；写：无当前模块写入op；既有或Mock数据 |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 组织成员标签/贡献；既有记录读取；无当前模块写入op；created_at | 读：read.member, helper.memberEntities；写：无当前模块写入op；既有或Mock数据 |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 组织成员标签/贡献；既有记录读取；无当前模块写入op；updated_at | 读：read.member, helper.memberEntities；写：无当前模块写入op；既有或Mock数据 |
| data.contribution | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 组织成员标签/贡献；既有记录读取；无当前模块写入op；contribution | 读：read.member, helper.memberEntities；写：无当前模块写入op；既有或Mock数据 |

关系：owner → $users.id; parent → entity.id组织。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### event · 活动

community706_json_record → physical:community706。草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；id | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；type | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；owner | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；parent | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；status | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；data | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；version | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；created_at | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；updated_at | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.title | string | submit/review发布非空；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；title | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.summary | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；summary | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.description | string | submit/review发布非空；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；description | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.city | string | submit/review城市白名单；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；city | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.organization_id | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；organization_id | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.space_id | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；space_id | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.venue_name | string | 无space_id时必需；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；venue_name | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.address | string | 无space_id时必需；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；address | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.starts_at | ISO string | submit/review合法未来时间；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；starts_at | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.ends_at | ISO string | submit/review晚于开始；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；ends_at | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.capacity | integer / null | submit/review null或正整数；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；capacity | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.price_minor | integer CNY minor | submit/review非负整数；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；price_minor | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.approval_required | boolean | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；approval_required | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.waitlist_enabled | boolean | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；waitlist_enabled | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.tags | string[] | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；tags | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.fit_description | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；fit_description | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.cover_url | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；cover_url | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.media | array<{type,url,label?}> | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；media | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.media[].type | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；media[].type | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.media[].url | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；media[].url | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.media[].label | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；media[].label | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.visibility | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；visibility | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.host_display | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；host_display | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.venue_display | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；venue_display | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.round | integer | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；round | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.published_at | ISO string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；published_at | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |
| data.source_event_id | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 草稿/发布/审核/筛选/报名/日历；publicEvent白名单；媒体含图、视频和链接；source_event_id | 读：read.events, read.calendar, read.event, read.entity, read.member, read.search, read.feed, read.mine, read.draft, read.reviews, read.review, read.progress, read.registration, read.attendees, read.campaign, community.saveCalendarShare, community.publicMedia；写：write.saveEvent, write.clone, write.submitEvent, write.review, write.cancelEvent |

关系：owner → $users.id; data.organization_id → entity.id组织; data.space_id → entity.id空间; data.source_event_id → event.id。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### eventSecret · 私有参与方式

community706_json_record → physical:community706。加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；id | 读：read.draft, write.access, community.privateMediaPermission；写：write.saveEvent |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；type | 读：read.draft, write.access, community.privateMediaPermission；写：write.saveEvent |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；owner | 读：read.draft, write.access, community.privateMediaPermission；写：write.saveEvent |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；parent | 读：read.draft, write.access, community.privateMediaPermission；写：write.saveEvent |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；status | 读：read.draft, write.access, community.privateMediaPermission；写：write.saveEvent |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；data | 读：read.draft, write.access, community.privateMediaPermission；写：write.saveEvent |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；version | 读：read.draft, write.access, community.privateMediaPermission；写：write.saveEvent |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；created_at | 读：read.draft, write.access, community.privateMediaPermission；写：write.saveEvent |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；updated_at | 读：read.draft, write.access, community.privateMediaPermission；写：write.saveEvent |
| data.payload | {iv,cipher}AES-GCM | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；payload | 读：read.draft, write.access, community.privateMediaPermission；写：write.saveEvent |
| data.payload.iv | base64 string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；payload.iv | 读：read.draft, write.access, community.privateMediaPermission；写：write.saveEvent |
| data.payload.cipher | base64 string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；payload.cipher | 读：read.draft, write.access, community.privateMediaPermission；写：write.saveEvent |
| decrypted.type | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；decrypted.type | 读：read.draft, write.access, community.privateMediaPermission；写：仅加密blob写入；无独立明文列 |
| decrypted.value | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；decrypted.value | 读：read.draft, write.access, community.privateMediaPermission；写：仅加密blob写入；无独立明文列 |
| decrypted.expires_at | ISO string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；decrypted.expires_at | 读：read.draft, write.access, community.privateMediaPermission；写：仅加密blob写入；无独立明文列 |
| decrypted.methods | array<{type,value,expires_at?}> | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；decrypted.methods | 读：read.draft, write.access, community.privateMediaPermission；写：仅加密blob写入；无独立明文列 |
| decrypted.methods[].type | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；decrypted.methods[].type | 读：read.draft, write.access, community.privateMediaPermission；写：仅加密blob写入；无独立明文列 |
| decrypted.methods[].value | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；decrypted.methods[].value | 读：read.draft, write.access, community.privateMediaPermission；写：仅加密blob写入；无独立明文列 |
| decrypted.methods[].expires_at | ISO string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 加密参与方式；兼容单方法与methods数组；私有QR值706-media:<id>；解密字段不是独立明文存储；decrypted.methods[].expires_at | 读：read.draft, write.access, community.privateMediaPermission；写：仅加密blob写入；无独立明文列 |

关系：parent → event.id; decrypted.methods[].value → GROUP_QR为media.id引用。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### registration · 报名与候补

community706_json_record → physical:community706。审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；id | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；type | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；owner | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；parent | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；status | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；data | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；version | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；created_at | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；updated_at | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |
| data.display_name | string | register非空；data子字段无DB类型/NOT NULL；仅operation显式校验 | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；display_name | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |
| data.motivation | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；motivation | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |
| data.approval_status | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；approval_status | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |
| data.contact_share_consent | boolean | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；contact_share_consent | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |
| data.consent_version | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；consent_version | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |
| data.consented_at | ISO string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；consented_at | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |
| data.payment_expires_at | ISO string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；payment_expires_at | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |
| data.payment_order_created | boolean | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；payment_order_created | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |
| data.payment_id | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；payment_id | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |
| data.approved_at | ISO string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 审批/免费确认/支付占位/候补递补；approved_at为历史或Mock字段，当前真实后端未赋值；approved_at | 读：read.registration, read.attendees, read.mine, read.event, read.events, read.member, read.entity, read.feed, read.people, write.access, write.registrationContact, community.expiryInfo, community.preparePayment, community.privateMediaPermission；写：write.register, write.registrationDecision, write.cancelRegistration, write.cancelEvent, community.expireHold, community.settlePayment, helper.nextRegistration, helper.promote |

关系：owner → $users.id; parent → event.id; data.payment_id → payment.id。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### review · 审核任务与历史

community706_json_record → physical:community706。平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；id | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；type | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；owner | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；parent | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；status | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；data | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；version | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；created_at | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；updated_at | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |
| data.scope | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；scope | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |
| data.entity_id | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；entity_id | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |
| data.round | integer | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；round | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |
| data.subject_type | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；subject_type | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |
| data.snapshot | record JSON | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；snapshot | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |
| data.title | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；title | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |
| data.event_id | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；event_id | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |
| data.note | string | 拒绝时必需；data子字段无DB类型/NOT NULL；仅operation显式校验 | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；note | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |
| data.decided_by | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；decided_by | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |
| data.decided_at | ISO string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 平台/组织/空间/活动发起人审核；snapshot与round保留历史、重提SUPERSEDED；decided_at | 读：read.reviews, read.review, read.progress；写：write.submitEvent, write.submitCampaign, write.review, write.saveEvent |

关系：owner → $users.id; parent → event.id/campaign.id; data.entity_id → entity.id; data.event_id → event.id; data.decided_by → $users.id。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### campaign · 活动专题

community706_json_record → physical:community706。活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；id | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；type | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；owner | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；parent | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；status | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；data | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；version | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；created_at | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；updated_at | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| data.title | string | submit非空；data子字段无DB类型/NOT NULL；仅operation显式校验 | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；title | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| data.kicker | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；kicker | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| data.introduction | string | submit非空；data子字段无DB类型/NOT NULL；仅operation显式校验 | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；introduction | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| data.cover_url | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；cover_url | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| data.organization_id | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；organization_id | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| data.event_ids | id[] | submit至少一个合法状态活动；data子字段无DB类型/NOT NULL；仅operation显式校验 | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；event_ids | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| data.resource_links | array(any),无严格shape | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；resource_links | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| data.media | array<{type,url,label?}> | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；media | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| data.media[].type | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；media[].type | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| data.media[].url | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；media[].url | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| data.media[].label | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；media[].label | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| data.visibility | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；visibility | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| data.round | integer | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；round | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |
| data.published_at | ISO string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 活动合集与关联发起人确认；拒绝剔除对应活动，空合集退回；published_at | 读：read.campaigns, read.campaign, read.event, read.mine, read.draft, read.reviews, read.review, read.progress, community.publicMedia；写：write.saveCampaign, write.submitCampaign, write.review |

关系：owner → $users.id; data.organization_id → entity.id; data.event_ids → event.id[]。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### notification · 站内通知

community706_json_record → physical:community706。站内通知/路由/已读；不是微信订阅消息；actor_id是可选读，notify未赋值

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | 站内通知/路由/已读；不是微信订阅消息；actor_id是可选读，notify未赋值；id | 读：read.notifications, read.me；写：write.read, helper.notify |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 站内通知/路由/已读；不是微信订阅消息；actor_id是可选读，notify未赋值；type | 读：read.notifications, read.me；写：write.read, helper.notify |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 站内通知/路由/已读；不是微信订阅消息；actor_id是可选读，notify未赋值；owner | 读：read.notifications, read.me；写：write.read, helper.notify |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 站内通知/路由/已读；不是微信订阅消息；actor_id是可选读，notify未赋值；parent | 读：read.notifications, read.me；写：write.read, helper.notify |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 站内通知/路由/已读；不是微信订阅消息；actor_id是可选读，notify未赋值；status | 读：read.notifications, read.me；写：write.read, helper.notify |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 站内通知/路由/已读；不是微信订阅消息；actor_id是可选读，notify未赋值；data | 读：read.notifications, read.me；写：write.read, helper.notify |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 站内通知/路由/已读；不是微信订阅消息；actor_id是可选读，notify未赋值；version | 读：read.notifications, read.me；写：write.read, helper.notify |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 站内通知/路由/已读；不是微信订阅消息；actor_id是可选读，notify未赋值；created_at | 读：read.notifications, read.me；写：write.read, helper.notify |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 站内通知/路由/已读；不是微信订阅消息；actor_id是可选读，notify未赋值；updated_at | 读：read.notifications, read.me；写：write.read, helper.notify |
| data.key | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 站内通知/路由/已读；不是微信订阅消息；actor_id是可选读，notify未赋值；key | 读：read.notifications, read.me；写：write.read, helper.notify |
| data.target | object{route,id?} | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 站内通知/路由/已读；不是微信订阅消息；actor_id是可选读，notify未赋值；target | 读：read.notifications, read.me；写：write.read, helper.notify |
| data.target.route | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 站内通知/路由/已读；不是微信订阅消息；actor_id是可选读，notify未赋值；target.route | 读：read.notifications, read.me；写：write.read, helper.notify |
| data.target.id | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 站内通知/路由/已读；不是微信订阅消息；actor_id是可选读，notify未赋值；target.id | 读：read.notifications, read.me；写：write.read, helper.notify |
| data.category | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 站内通知/路由/已读；不是微信订阅消息；actor_id是可选读，notify未赋值；category | 读：read.notifications, read.me；写：write.read, helper.notify |
| data.actor_id | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 站内通知/路由/已读；不是微信订阅消息；actor_id是可选读，notify未赋值；actor_id | 读：read.notifications, read.me；写：write.read, helper.notify |
| data.read_at | ISO string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 站内通知/路由/已读；不是微信订阅消息；actor_id是可选读，notify未赋值；read_at | 读：read.notifications, read.me；写：write.read, helper.notify |

关系：owner → $users.id; data.target.id → route指向event/registration/campaign; data.actor_id → $users.id。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### follow · 关注关系

community706_json_record → physical:community706。owner关注parent用户/实体；ACTIVE/INACTIVE保留

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | owner关注parent用户/实体；ACTIVE/INACTIVE保留；id | 读：read.me, read.member, read.people, read.entity, read.relations；写：write.follow, write.profile(follow_spaces) |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner关注parent用户/实体；ACTIVE/INACTIVE保留；type | 读：read.me, read.member, read.people, read.entity, read.relations；写：write.follow, write.profile(follow_spaces) |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner关注parent用户/实体；ACTIVE/INACTIVE保留；owner | 读：read.me, read.member, read.people, read.entity, read.relations；写：write.follow, write.profile(follow_spaces) |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner关注parent用户/实体；ACTIVE/INACTIVE保留；parent | 读：read.me, read.member, read.people, read.entity, read.relations；写：write.follow, write.profile(follow_spaces) |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner关注parent用户/实体；ACTIVE/INACTIVE保留；status | 读：read.me, read.member, read.people, read.entity, read.relations；写：write.follow, write.profile(follow_spaces) |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner关注parent用户/实体；ACTIVE/INACTIVE保留；data | 读：read.me, read.member, read.people, read.entity, read.relations；写：write.follow, write.profile(follow_spaces) |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner关注parent用户/实体；ACTIVE/INACTIVE保留；version | 读：read.me, read.member, read.people, read.entity, read.relations；写：write.follow, write.profile(follow_spaces) |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner关注parent用户/实体；ACTIVE/INACTIVE保留；created_at | 读：read.me, read.member, read.people, read.entity, read.relations；写：write.follow, write.profile(follow_spaces) |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner关注parent用户/实体；ACTIVE/INACTIVE保留；updated_at | 读：read.me, read.member, read.people, read.entity, read.relations；写：write.follow, write.profile(follow_spaces) |

关系：owner → $users.id; parent → $users.id/entity.id。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### mute · 屏蔽关系

community706_json_record → physical:community706。本人屏蔽对方动态；无当前取消屏蔽op

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | 本人屏蔽对方动态；无当前取消屏蔽op；id | 读：read.feed；写：write.mute |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 本人屏蔽对方动态；无当前取消屏蔽op；type | 读：read.feed；写：write.mute |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 本人屏蔽对方动态；无当前取消屏蔽op；owner | 读：read.feed；写：write.mute |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 本人屏蔽对方动态；无当前取消屏蔽op；parent | 读：read.feed；写：write.mute |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 本人屏蔽对方动态；无当前取消屏蔽op；status | 读：read.feed；写：write.mute |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 本人屏蔽对方动态；无当前取消屏蔽op；data | 读：read.feed；写：write.mute |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 本人屏蔽对方动态；无当前取消屏蔽op；version | 读：read.feed；写：write.mute |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 本人屏蔽对方动态；无当前取消屏蔽op；created_at | 读：read.feed；写：write.mute |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 本人屏蔽对方动态；无当前取消屏蔽op；updated_at | 读：read.feed；写：write.mute |

关系：owner → $users.id; parent → $users.id。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### report · 举报与反馈

community706_json_record → physical:community706。OPEN反馈记录；无前端后台处理read，不等于已解决

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | OPEN反馈记录；无前端后台处理read，不等于已解决；id | 读：后台既有数据，无公开read, op；写：write.report |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | OPEN反馈记录；无前端后台处理read，不等于已解决；type | 读：后台既有数据，无公开read, op；写：write.report |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | OPEN反馈记录；无前端后台处理read，不等于已解决；owner | 读：后台既有数据，无公开read, op；写：write.report |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | OPEN反馈记录；无前端后台处理read，不等于已解决；parent | 读：后台既有数据，无公开read, op；写：write.report |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | OPEN反馈记录；无前端后台处理read，不等于已解决；status | 读：后台既有数据，无公开read, op；写：write.report |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | OPEN反馈记录；无前端后台处理read，不等于已解决；data | 读：后台既有数据，无公开read, op；写：write.report |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | OPEN反馈记录；无前端后台处理read，不等于已解决；version | 读：后台既有数据，无公开read, op；写：write.report |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | OPEN反馈记录；无前端后台处理read，不等于已解决；created_at | 读：后台既有数据，无公开read, op；写：write.report |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | OPEN反馈记录；无前端后台处理read，不等于已解决；updated_at | 读：后台既有数据，无公开read, op；写：write.report |
| data.reason | string | report非空；data子字段无DB类型/NOT NULL；仅operation显式校验 | OPEN反馈记录；无前端后台处理read，不等于已解决；reason | 读：后台既有数据，无公开read, op；写：write.report |

关系：owner → $users.id; parent → 业务id或空。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### comment · 评论回复

community706_json_record → physical:community706。同活动回复链与软删除；recommendation_id是badge历史可选读取，当前写comment不赋值

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | 同活动回复链与软删除；recommendation_id是badge历史可选读取，当前写comment不赋值；id | 读：read.comments, read.event, read.mine；写：write.comment, write.deleteComment |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 同活动回复链与软删除；recommendation_id是badge历史可选读取，当前写comment不赋值；type | 读：read.comments, read.event, read.mine；写：write.comment, write.deleteComment |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 同活动回复链与软删除；recommendation_id是badge历史可选读取，当前写comment不赋值；owner | 读：read.comments, read.event, read.mine；写：write.comment, write.deleteComment |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 同活动回复链与软删除；recommendation_id是badge历史可选读取，当前写comment不赋值；parent | 读：read.comments, read.event, read.mine；写：write.comment, write.deleteComment |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 同活动回复链与软删除；recommendation_id是badge历史可选读取，当前写comment不赋值；status | 读：read.comments, read.event, read.mine；写：write.comment, write.deleteComment |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 同活动回复链与软删除；recommendation_id是badge历史可选读取，当前写comment不赋值；data | 读：read.comments, read.event, read.mine；写：write.comment, write.deleteComment |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 同活动回复链与软删除；recommendation_id是badge历史可选读取，当前写comment不赋值；version | 读：read.comments, read.event, read.mine；写：write.comment, write.deleteComment |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 同活动回复链与软删除；recommendation_id是badge历史可选读取，当前写comment不赋值；created_at | 读：read.comments, read.event, read.mine；写：write.comment, write.deleteComment |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 同活动回复链与软删除；recommendation_id是badge历史可选读取，当前写comment不赋值；updated_at | 读：read.comments, read.event, read.mine；写：write.comment, write.deleteComment |
| data.text | string | comment非空；data子字段无DB类型/NOT NULL；仅operation显式校验 | 同活动回复链与软删除；recommendation_id是badge历史可选读取，当前写comment不赋值；text | 读：read.comments, read.event, read.mine；写：write.comment, write.deleteComment |
| data.reply_to | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 同活动回复链与软删除；recommendation_id是badge历史可选读取，当前写comment不赋值；reply_to | 读：read.comments, read.event, read.mine；写：write.comment, write.deleteComment |
| data.recommendation_id | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 同活动回复链与软删除；recommendation_id是badge历史可选读取，当前写comment不赋值；recommendation_id | 读：read.comments, read.event, read.mine；写：write.comment, write.deleteComment |

关系：owner → $users.id; parent → event.id; data.reply_to → comment.id同活动; data.recommendation_id → recommendation.id(可选历史)。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### recommendation · 活动推荐

community706_json_record → physical:community706。公开推荐理由与撤回、共同推荐

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | 公开推荐理由与撤回、共同推荐；id | 读：read.feed, read.people, read.event, read.events, read.comments；写：write.recommend |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 公开推荐理由与撤回、共同推荐；type | 读：read.feed, read.people, read.event, read.events, read.comments；写：write.recommend |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 公开推荐理由与撤回、共同推荐；owner | 读：read.feed, read.people, read.event, read.events, read.comments；写：write.recommend |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 公开推荐理由与撤回、共同推荐；parent | 读：read.feed, read.people, read.event, read.events, read.comments；写：write.recommend |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 公开推荐理由与撤回、共同推荐；status | 读：read.feed, read.people, read.event, read.events, read.comments；写：write.recommend |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 公开推荐理由与撤回、共同推荐；data | 读：read.feed, read.people, read.event, read.events, read.comments；写：write.recommend |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 公开推荐理由与撤回、共同推荐；version | 读：read.feed, read.people, read.event, read.events, read.comments；写：write.recommend |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 公开推荐理由与撤回、共同推荐；created_at | 读：read.feed, read.people, read.event, read.events, read.comments；写：write.recommend |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 公开推荐理由与撤回、共同推荐；updated_at | 读：read.feed, read.people, read.event, read.events, read.comments；写：write.recommend |
| data.text | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 公开推荐理由与撤回、共同推荐；text | 读：read.feed, read.people, read.event, read.events, read.comments；写：write.recommend |

关系：owner → $users.id; parent → event.id。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### command · 写入幂等

community706_json_record → physical:community706。owner+key幂等；input SHA256、普通result缓存；access/registrationContact不缓存

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | owner+key幂等；input SHA256、普通result缓存；access/registrationContact不缓存；id | 读：community.write, duplicate, lookup；写：community.write, wrapper |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner+key幂等；input SHA256、普通result缓存；access/registrationContact不缓存；type | 读：community.write, duplicate, lookup；写：community.write, wrapper |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner+key幂等；input SHA256、普通result缓存；access/registrationContact不缓存；owner | 读：community.write, duplicate, lookup；写：community.write, wrapper |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner+key幂等；input SHA256、普通result缓存；access/registrationContact不缓存；parent | 读：community.write, duplicate, lookup；写：community.write, wrapper |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner+key幂等；input SHA256、普通result缓存；access/registrationContact不缓存；status | 读：community.write, duplicate, lookup；写：community.write, wrapper |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner+key幂等；input SHA256、普通result缓存；access/registrationContact不缓存；data | 读：community.write, duplicate, lookup；写：community.write, wrapper |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner+key幂等；input SHA256、普通result缓存；access/registrationContact不缓存；version | 读：community.write, duplicate, lookup；写：community.write, wrapper |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner+key幂等；input SHA256、普通result缓存；access/registrationContact不缓存；created_at | 读：community.write, duplicate, lookup；写：community.write, wrapper |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner+key幂等；input SHA256、普通result缓存；access/registrationContact不缓存；updated_at | 读：community.write, duplicate, lookup；写：community.write, wrapper |
| data.operation | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | owner+key幂等；input SHA256、普通result缓存；access/registrationContact不缓存；operation | 读：community.write, duplicate, lookup；写：community.write, wrapper |
| data.input | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | owner+key幂等；input SHA256、普通result缓存；access/registrationContact不缓存；input | 读：community.write, duplicate, lookup；写：community.write, wrapper |
| data.result | any JSON | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | owner+key幂等；input SHA256、普通result缓存；access/registrationContact不缓存；result | 读：community.write, duplicate, lookup；写：community.write, wrapper |

关系：owner → $users.id; parent → caller key不是FK。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### audit · 后台操作记录

community706_json_record → physical:community706。后台操作/权限变化/私有读取记录；operator额外保存changed_ids

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | 后台操作/权限变化/私有读取记录；operator额外保存changed_ids；id | 读：后台追踪，无公开read, op；写：helper.audit, operator.initialConfiguration |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 后台操作/权限变化/私有读取记录；operator额外保存changed_ids；type | 读：后台追踪，无公开read, op；写：helper.audit, operator.initialConfiguration |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 后台操作/权限变化/私有读取记录；operator额外保存changed_ids；owner | 读：后台追踪，无公开read, op；写：helper.audit, operator.initialConfiguration |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 后台操作/权限变化/私有读取记录；operator额外保存changed_ids；parent | 读：后台追踪，无公开read, op；写：helper.audit, operator.initialConfiguration |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 后台操作/权限变化/私有读取记录；operator额外保存changed_ids；status | 读：后台追踪，无公开read, op；写：helper.audit, operator.initialConfiguration |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 后台操作/权限变化/私有读取记录；operator额外保存changed_ids；data | 读：后台追踪，无公开read, op；写：helper.audit, operator.initialConfiguration |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 后台操作/权限变化/私有读取记录；operator额外保存changed_ids；version | 读：后台追踪，无公开read, op；写：helper.audit, operator.initialConfiguration |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 后台操作/权限变化/私有读取记录；operator额外保存changed_ids；created_at | 读：后台追踪，无公开read, op；写：helper.audit, operator.initialConfiguration |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 后台操作/权限变化/私有读取记录；operator额外保存changed_ids；updated_at | 读：后台追踪，无公开read, op；写：helper.audit, operator.initialConfiguration |
| data.action | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 后台操作/权限变化/私有读取记录；operator额外保存changed_ids；action | 读：后台追踪，无公开read, op；写：helper.audit, operator.initialConfiguration |
| data.changed_ids | id[] | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 后台操作/权限变化/私有读取记录；operator额外保存changed_ids；changed_ids | 读：后台追踪，无公开read, op；写：helper.audit, operator.initialConfiguration |

关系：owner → $users.id或operator-cli; parent → 行为目标或空; data.changed_ids → operator变更ids。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### payment · 微信付款订单

community706_json_record → physical:community706。可信订单金额/微信回调/幂等结算/晚付款requires_refund；不是自动退款实现

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | 可信订单金额/微信回调/幂等结算/晚付款requires_refund；不是自动退款实现；id | 读：community.preparePayment, community.expiryInfo, community.settlePayment, community.expire；写：community.preparePayment, community.settlePayment |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 可信订单金额/微信回调/幂等结算/晚付款requires_refund；不是自动退款实现；type | 读：community.preparePayment, community.expiryInfo, community.settlePayment, community.expire；写：community.preparePayment, community.settlePayment |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 可信订单金额/微信回调/幂等结算/晚付款requires_refund；不是自动退款实现；owner | 读：community.preparePayment, community.expiryInfo, community.settlePayment, community.expire；写：community.preparePayment, community.settlePayment |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 可信订单金额/微信回调/幂等结算/晚付款requires_refund；不是自动退款实现；parent | 读：community.preparePayment, community.expiryInfo, community.settlePayment, community.expire；写：community.preparePayment, community.settlePayment |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 可信订单金额/微信回调/幂等结算/晚付款requires_refund；不是自动退款实现；status | 读：community.preparePayment, community.expiryInfo, community.settlePayment, community.expire；写：community.preparePayment, community.settlePayment |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 可信订单金额/微信回调/幂等结算/晚付款requires_refund；不是自动退款实现；data | 读：community.preparePayment, community.expiryInfo, community.settlePayment, community.expire；写：community.preparePayment, community.settlePayment |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 可信订单金额/微信回调/幂等结算/晚付款requires_refund；不是自动退款实现；version | 读：community.preparePayment, community.expiryInfo, community.settlePayment, community.expire；写：community.preparePayment, community.settlePayment |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 可信订单金额/微信回调/幂等结算/晚付款requires_refund；不是自动退款实现；created_at | 读：community.preparePayment, community.expiryInfo, community.settlePayment, community.expire；写：community.preparePayment, community.settlePayment |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 可信订单金额/微信回调/幂等结算/晚付款requires_refund；不是自动退款实现；updated_at | 读：community.preparePayment, community.expiryInfo, community.settlePayment, community.expire；写：community.preparePayment, community.settlePayment |
| data.amount_minor | integer CNY minor | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 可信订单金额/微信回调/幂等结算/晚付款requires_refund；不是自动退款实现；amount_minor | 读：community.preparePayment, community.expiryInfo, community.settlePayment, community.expire；写：community.preparePayment, community.settlePayment |
| data.appid | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 可信订单金额/微信回调/幂等结算/晚付款requires_refund；不是自动退款实现；appid | 读：community.preparePayment, community.expiryInfo, community.settlePayment, community.expire；写：community.preparePayment, community.settlePayment |
| data.mchid | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 可信订单金额/微信回调/幂等结算/晚付款requires_refund；不是自动退款实现；mchid | 读：community.preparePayment, community.expiryInfo, community.settlePayment, community.expire；写：community.preparePayment, community.settlePayment |
| data.transaction_id | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 可信订单金额/微信回调/幂等结算/晚付款requires_refund；不是自动退款实现；transaction_id | 读：community.preparePayment, community.expiryInfo, community.settlePayment, community.expire；写：community.preparePayment, community.settlePayment |
| data.paid_at | ISO string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 可信订单金额/微信回调/幂等结算/晚付款requires_refund；不是自动退款实现；paid_at | 读：community.preparePayment, community.expiryInfo, community.settlePayment, community.expire；写：community.preparePayment, community.settlePayment |
| data.requires_refund | boolean | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 可信订单金额/微信回调/幂等结算/晚付款requires_refund；不是自动退款实现；requires_refund | 读：community.preparePayment, community.expiryInfo, community.settlePayment, community.expire；写：community.preparePayment, community.settlePayment |

关系：owner → $users.id; parent → registration.id。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### wechatIdentity · 微信身份

community706_json_record → physical:community706。parent=digest(appid,openid)去重；AES-GCM加密openid；不授予管理员

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | parent=digest(appid,openid)去重；AES-GCM加密openid；不授予管理员；id | 读：community.preparePayment, community.wechatIdentity；写：community.wechatIdentity |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | parent=digest(appid,openid)去重；AES-GCM加密openid；不授予管理员；type | 读：community.preparePayment, community.wechatIdentity；写：community.wechatIdentity |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | parent=digest(appid,openid)去重；AES-GCM加密openid；不授予管理员；owner | 读：community.preparePayment, community.wechatIdentity；写：community.wechatIdentity |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | parent=digest(appid,openid)去重；AES-GCM加密openid；不授予管理员；parent | 读：community.preparePayment, community.wechatIdentity；写：community.wechatIdentity |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | parent=digest(appid,openid)去重；AES-GCM加密openid；不授予管理员；status | 读：community.preparePayment, community.wechatIdentity；写：community.wechatIdentity |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | parent=digest(appid,openid)去重；AES-GCM加密openid；不授予管理员；data | 读：community.preparePayment, community.wechatIdentity；写：community.wechatIdentity |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | parent=digest(appid,openid)去重；AES-GCM加密openid；不授予管理员；version | 读：community.preparePayment, community.wechatIdentity；写：community.wechatIdentity |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | parent=digest(appid,openid)去重；AES-GCM加密openid；不授予管理员；created_at | 读：community.preparePayment, community.wechatIdentity；写：community.wechatIdentity |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | parent=digest(appid,openid)去重；AES-GCM加密openid；不授予管理员；updated_at | 读：community.preparePayment, community.wechatIdentity；写：community.wechatIdentity |
| data.encrypted | {iv,cipher}AES-GCM | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | parent=digest(appid,openid)去重；AES-GCM加密openid；不授予管理员；encrypted | 读：community.preparePayment, community.wechatIdentity；写：community.wechatIdentity |
| data.encrypted.iv | base64 string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | parent=digest(appid,openid)去重；AES-GCM加密openid；不授予管理员；encrypted.iv | 读：community.preparePayment, community.wechatIdentity；写：community.wechatIdentity |
| data.encrypted.cipher | base64 string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | parent=digest(appid,openid)去重；AES-GCM加密openid；不授予管理员；encrypted.cipher | 读：community.preparePayment, community.wechatIdentity；写：community.wechatIdentity |
| decrypted.openid | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | parent=digest(appid,openid)去重；AES-GCM加密openid；不授予管理员；decrypted.openid | 读：community.preparePayment, community.wechatIdentity；写：仅加密blob写入；无独立明文列 |

关系：owner → $users.id; parent → SHA256(appid,openid)。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### media · 媒体引用

community706_json_record → physical:community706。parent=$files.path，非$file.id；公开引用/私有能力实时授权，业务层记录

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | parent=$files.path，非$file.id；公开引用/私有能力实时授权，业务层记录；id | 读：community.publicMedia, community.privateMediaPermission, community.mediaPreview, write.saveEvent, read.event, read.campaign；写：community.registerMedia |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | parent=$files.path，非$file.id；公开引用/私有能力实时授权，业务层记录；type | 读：community.publicMedia, community.privateMediaPermission, community.mediaPreview, write.saveEvent, read.event, read.campaign；写：community.registerMedia |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | parent=$files.path，非$file.id；公开引用/私有能力实时授权，业务层记录；owner | 读：community.publicMedia, community.privateMediaPermission, community.mediaPreview, write.saveEvent, read.event, read.campaign；写：community.registerMedia |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | parent=$files.path，非$file.id；公开引用/私有能力实时授权，业务层记录；parent | 读：community.publicMedia, community.privateMediaPermission, community.mediaPreview, write.saveEvent, read.event, read.campaign；写：community.registerMedia |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | parent=$files.path，非$file.id；公开引用/私有能力实时授权，业务层记录；status | 读：community.publicMedia, community.privateMediaPermission, community.mediaPreview, write.saveEvent, read.event, read.campaign；写：community.registerMedia |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | parent=$files.path，非$file.id；公开引用/私有能力实时授权，业务层记录；data | 读：community.publicMedia, community.privateMediaPermission, community.mediaPreview, write.saveEvent, read.event, read.campaign；写：community.registerMedia |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | parent=$files.path，非$file.id；公开引用/私有能力实时授权，业务层记录；version | 读：community.publicMedia, community.privateMediaPermission, community.mediaPreview, write.saveEvent, read.event, read.campaign；写：community.registerMedia |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | parent=$files.path，非$file.id；公开引用/私有能力实时授权，业务层记录；created_at | 读：community.publicMedia, community.privateMediaPermission, community.mediaPreview, write.saveEvent, read.event, read.campaign；写：community.registerMedia |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | parent=$files.path，非$file.id；公开引用/私有能力实时授权，业务层记录；updated_at | 读：community.publicMedia, community.privateMediaPermission, community.mediaPreview, write.saveEvent, read.event, read.campaign；写：community.registerMedia |
| data.private | boolean | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | parent=$files.path，非$file.id；公开引用/私有能力实时授权，业务层记录；private | 读：community.publicMedia, community.privateMediaPermission, community.mediaPreview, write.saveEvent, read.event, read.campaign；写：community.registerMedia |

关系：owner → $users.id; parent → $files.path。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### calendarShare · 日历分享

community706_json_record → physical:community706。允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | 允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片；id | 读：read.calendarShare, community.calendarCode；写：community.saveCalendarShare |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片；type | 读：read.calendarShare, community.calendarCode；写：community.saveCalendarShare |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片；owner | 读：read.calendarShare, community.calendarCode；写：community.saveCalendarShare |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片；parent | 读：read.calendarShare, community.calendarCode；写：community.saveCalendarShare |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片；status | 读：read.calendarShare, community.calendarCode；写：community.saveCalendarShare |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片；data | 读：read.calendarShare, community.calendarCode；写：community.saveCalendarShare |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片；version | 读：read.calendarShare, community.calendarCode；写：community.saveCalendarShare |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片；created_at | 读：read.calendarShare, community.calendarCode；写：community.saveCalendarShare |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片；updated_at | 读：read.calendarShare, community.calendarCode；写：community.saveCalendarShare |
| data.params | object | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片；params | 读：read.calendarShare, community.calendarCode；写：community.saveCalendarShare |
| data.params.city | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片；params.city | 读：read.calendarShare, community.calendarCode；写：community.saveCalendarShare |
| data.params.from | ISO string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片；params.from | 读：read.calendarShare, community.calendarCode；写：community.saveCalendarShare |
| data.params.to | ISO string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片；params.to | 读：read.calendarShare, community.calendarCode；写：community.saveCalendarShare |
| data.params.space_id | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片；params.space_id | 读：read.calendarShare, community.calendarCode；写：community.saveCalendarShare |
| data.params.tag | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片；params.tag | 读：read.calendarShare, community.calendarCode；写：community.saveCalendarShare |
| data.params.free_only | boolean | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片；params.free_only | 读：read.calendarShare, community.calendarCode；写：community.saveCalendarShare |
| data.params.has_capacity | boolean | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片；params.has_capacity | 读：read.calendarShare, community.calendarCode；写：community.saveCalendarShare |
| data.source_updated_at | ISO string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | 允许的筛选与时段回流；source_updated_at源数据版本；真实code仅action返回不存图片；source_updated_at | 读：read.calendarShare, community.calendarCode；写：community.saveCalendarShare |

关系：owner → $users.id; data.params.space_id → entity.id。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### invitation · 管理员邀请

community706_json_record → physical:community706。owner被邀请用户，parent实体；邀请者失权后拒绝，撤销role同步pending邀请

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | owner被邀请用户，parent实体；邀请者失权后拒绝，撤销role同步pending邀请；id | 读：read.invitations；写：write.invite, write.acceptInvite, write.revokeRole |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner被邀请用户，parent实体；邀请者失权后拒绝，撤销role同步pending邀请；type | 读：read.invitations；写：write.invite, write.acceptInvite, write.revokeRole |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner被邀请用户，parent实体；邀请者失权后拒绝，撤销role同步pending邀请；owner | 读：read.invitations；写：write.invite, write.acceptInvite, write.revokeRole |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner被邀请用户，parent实体；邀请者失权后拒绝，撤销role同步pending邀请；parent | 读：read.invitations；写：write.invite, write.acceptInvite, write.revokeRole |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner被邀请用户，parent实体；邀请者失权后拒绝，撤销role同步pending邀请；status | 读：read.invitations；写：write.invite, write.acceptInvite, write.revokeRole |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner被邀请用户，parent实体；邀请者失权后拒绝，撤销role同步pending邀请；data | 读：read.invitations；写：write.invite, write.acceptInvite, write.revokeRole |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner被邀请用户，parent实体；邀请者失权后拒绝，撤销role同步pending邀请；version | 读：read.invitations；写：write.invite, write.acceptInvite, write.revokeRole |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner被邀请用户，parent实体；邀请者失权后拒绝，撤销role同步pending邀请；created_at | 读：read.invitations；写：write.invite, write.acceptInvite, write.revokeRole |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | owner被邀请用户，parent实体；邀请者失权后拒绝，撤销role同步pending邀请；updated_at | 读：read.invitations；写：write.invite, write.acceptInvite, write.revokeRole |
| data.inviter | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | owner被邀请用户，parent实体；邀请者失权后拒绝，撤销role同步pending邀请；inviter | 读：read.invitations；写：write.invite, write.acceptInvite, write.revokeRole |
| data.role | string | 可选、阶段派生或既有历史；见具体operation；data子字段无DB类型/NOT NULL；仅operation显式校验 | owner被邀请用户，parent实体；邀请者失权后拒绝，撤销role同步pending邀请；role | 读：read.invitations；写：write.invite, write.acceptInvite, write.revokeRole |

关系：owner → $users.id被邀请者; parent → entity.id; data.inviter → $users.id。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### guard · 全局串行锁

community706_json_record → physical:community706。固定初始化锁行；updated_at写取得事务行锁；无用户页面

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text PK | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | 固定初始化锁行；updated_at写取得事务行锁；无用户页面；id | 读：所有状态mutation锁行；写：deploy.initialGuard, community.write, community.preparePayment, community.settlePayment, community.expireHold, community.wechatIdentity |
| type | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 固定初始化锁行；updated_at写取得事务行锁；无用户页面；type | 读：所有状态mutation锁行；写：deploy.initialGuard, community.write, community.preparePayment, community.settlePayment, community.expireHold, community.wechatIdentity |
| owner | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 固定初始化锁行；updated_at写取得事务行锁；无用户页面；owner | 读：所有状态mutation锁行；写：deploy.initialGuard, community.write, community.preparePayment, community.settlePayment, community.expireHold, community.wechatIdentity |
| parent | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 固定初始化锁行；updated_at写取得事务行锁；无用户页面；parent | 读：所有状态mutation锁行；写：deploy.initialGuard, community.write, community.preparePayment, community.settlePayment, community.expireHold, community.wechatIdentity |
| status | text | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 固定初始化锁行；updated_at写取得事务行锁；无用户页面；status | 读：所有状态mutation锁行；写：deploy.initialGuard, community.write, community.preparePayment, community.settlePayment, community.expireHold, community.wechatIdentity |
| data | jsonb | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 固定初始化锁行；updated_at写取得事务行锁；无用户页面；data | 读：所有状态mutation锁行；写：deploy.initialGuard, community.write, community.preparePayment, community.settlePayment, community.expireHold, community.wechatIdentity |
| version | double precision | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 固定初始化锁行；updated_at写取得事务行锁；无用户页面；version | 读：所有状态mutation锁行；写：deploy.initialGuard, community.write, community.preparePayment, community.settlePayment, community.expireHold, community.wechatIdentity |
| created_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 固定初始化锁行；updated_at写取得事务行锁；无用户页面；created_at | 读：所有状态mutation锁行；写：deploy.initialGuard, community.write, community.preparePayment, community.settlePayment, community.expireHold, community.wechatIdentity |
| updated_at | text ISO | put默认/生成，id SQL主键；version递增；id PRIMARY KEY，其他历史schema未required | 固定初始化锁行；updated_at写取得事务行锁；无用户页面；updated_at | 读：所有状态mutation锁行；写：deploy.initialGuard, community.write, community.preparePayment, community.settlePayment, community.expireHold, community.wechatIdentity |

关系：id → 固定全局锁行。

索引：id text PK；部署意图补type/owner/parent/status/created_at单列索引；历史预v6为false；当前未查。

### $users · 运行时账户

system_tenant_sql_entity → physical:$users。系统账户；token存独立runtime表，不在$user对象

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| email | text | runtime按操作创建/省略；非每个字段都必填；历史schema required?=false，非NOT NULL | 实际SQL列、记录身份/状态/检索或运行时元数据 | 读：Auth/Storage runtime；写：Auth/Storage runtime |
| id | text PRIMARY KEY | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | 实际SQL列、记录身份/状态/检索或运行时元数据 | 读：Auth/Storage runtime；写：Auth/Storage runtime |
| imageURL | text | runtime按操作创建/省略；非每个字段都必填；历史schema required?=false，非NOT NULL | 实际SQL列、记录身份/状态/检索或运行时元数据 | 读：Auth/Storage runtime；写：Auth/Storage runtime |
| phone | text | runtime按操作创建/省略；非每个字段都必填；历史schema required?=false，非NOT NULL | 实际SQL列、记录身份/状态/检索或运行时元数据 | 读：Auth/Storage runtime；写：Auth/Storage runtime |
| type | text | runtime按操作创建/省略；非每个字段都必填；历史schema required?=false，非NOT NULL | 实际SQL列、记录身份/状态/检索或运行时元数据 | 读：Auth/Storage runtime；写：Auth/Storage runtime |
| status | string read expectation | active比较SUSPENDED/DELETED；未确认实际schema扩展，非已确认持久字段 | 账户停用校验依赖；不能凭read断言列存在 | 读：community.active, operator.account；写：当前模块无writer；外部治理未知 |

关系：id → community706.owner及身份关系。

索引：id text PK；unique/index详见字段；SQL名由attr id派生。

### $files · 文件元数据

system_tenant_sql_entity → physical:$files。文件bytes存S3；SQL元数据location-id引用对象key；url动态签名计算，SQL列通常空

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| cache-control | text | runtime按操作创建/省略；非每个字段都必填；历史schema required?=false，非NOT NULL | 实际SQL列、记录身份/状态/检索或运行时元数据 | 读：Auth/Storage runtime；写：Auth/Storage runtime |
| id | text PRIMARY KEY | SQL PRIMARY KEY实际必填；运行时生成id；旧attr required?=false是声明metadata，不能覆盖SQL约束；id text PRIMARY KEY，SQL NOT NULL；其余根列历史schema非required | 实际SQL列、记录身份/状态/检索或运行时元数据 | 读：Auth/Storage runtime；写：Auth/Storage runtime |
| metadata | jsonb | runtime按操作创建/省略；非每个字段都必填；历史schema required?=false，非NOT NULL | 实际SQL列、记录身份/状态/检索或运行时元数据 | 读：Auth/Storage runtime；写：Auth/Storage runtime |
| path | text | runtime按操作创建/省略；非每个字段都必填；历史schema required?=false，非NOT NULL | 实际SQL列、记录身份/状态/检索或运行时元数据 | 读：Auth/Storage runtime；写：Auth/Storage runtime |
| url | text | runtime按操作创建/省略；非每个字段都必填；历史schema required?=false，非NOT NULL | 实际SQL列、记录身份/状态/检索或运行时元数据 | 读：Auth/Storage runtime；写：Auth/Storage runtime |
| size | double precision | Storage记录，nil省略；ensure attrs动态补齐；当前存在性未查，源码声明非required | 文件MIME/大小/物理location或呈现 | 读：Storage.download, community.registerMedia；写：Storage.record |
| content-type | text | Storage记录，nil省略；ensure attrs动态补齐；当前存在性未查，源码声明非required | 文件MIME/大小/物理location或呈现 | 读：Storage.download, community.registerMedia；写：Storage.record |
| content-disposition | text | Storage记录，nil省略；ensure attrs动态补齐；当前存在性未查，源码声明非required | 文件MIME/大小/物理location或呈现 | 读：Storage.download, community.registerMedia；写：Storage.record |
| location-id | text | Storage记录，nil省略；ensure attrs动态补齐；当前存在性未查，源码声明非required | 文件MIME/大小/物理location或呈现 | 读：Storage.download, community.registerMedia；写：Storage.record |

关系：path → media.parent。

索引：id text PK；unique/index详见字段；SQL名由attr id派生。

### runtime:apps · apps

runtime_sql_support → physical:runtime:apps。App配置/真实pg_schema解析；其他迁移可扩展设置，当前只列相关基线

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text | runtime对应内部流程写入；PK/NOT NULL | App配置/真实pg_schema解析；其他迁移可扩展设置，当前只列相关基线 | 读：Montana runtime apps；写：Montana runtime apps |
| title | text | runtime对应内部流程写入；PK/NOT NULL | App配置/真实pg_schema解析；其他迁移可扩展设置，当前只列相关基线 | 读：Montana runtime apps；写：Montana runtime apps |
| pg_schema | text | runtime对应内部流程写入；PK/NOT NULL | App配置/真实pg_schema解析；其他迁移可扩展设置，当前只列相关基线 | 读：Montana runtime apps；写：Montana runtime apps |
| admin_token_hash | binary | runtime对应内部流程写入；PK/NOT NULL | App配置/真实pg_schema解析；其他迁移可扩展设置，当前只列相关基线 | 读：Montana runtime apps；写：Montana runtime apps |
| inserted_at | utc_datetime_usec | framework-generated；migration macro | 后台主键/时间 | 读：runtime；写：runtime |
| updated_at | utc_datetime_usec | framework-generated；migration macro | 后台主键/时间 | 读：runtime；写：runtime |
| schema_version | bigint | schema_version默认0；db_role可空；migration定义 | schema版本/租户隔离角色 | 读：Schema/Apps；写：Schema migration |
| db_role | text | schema_version默认0；db_role可空；migration定义 | schema版本/租户隔离角色 | 读：Schema/Apps；写：Schema migration |

关系：未声明跨对象关系。

索引：create unique_index(:apps, [:pg_schema], prefix: system_schema())。

### runtime:attrs · attrs

runtime_sql_support → physical:runtime:attrs。实体到SQL表列的schema元数据/类型/索引/约束；非业务记录

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text | runtime对应内部流程写入；PK/NOT NULL | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| app_id | text FK system.apps.id | runtime对应内部流程写入；PK/NOT NULL | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| fwd_ident_id | text | runtime对应内部流程写入；PK/NOT NULL | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| fwd_etype | text | runtime对应内部流程写入；PK/NOT NULL | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| fwd_label | text | runtime对应内部流程写入；PK/NOT NULL | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| rev_ident_id | text | runtime对应内部流程写入；nullable/default见migration | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| rev_etype | text | runtime对应内部流程写入；nullable/default见migration | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| rev_label | text | runtime对应内部流程写入；nullable/default见migration | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| value_type | text | runtime对应内部流程写入；PK/NOT NULL | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| cardinality | text | runtime对应内部流程写入；PK/NOT NULL | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| is_unique | boolean | runtime对应内部流程写入；PK/NOT NULL | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| is_indexed | boolean | runtime对应内部流程写入；PK/NOT NULL | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| is_required | boolean | runtime对应内部流程写入；PK/NOT NULL | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| checked_data_type | text | runtime对应内部流程写入；nullable/default见migration | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| on_delete | text | runtime对应内部流程写入；nullable/default见migration | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| on_delete_reverse | text | runtime对应内部流程写入；nullable/default见migration | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| catalog | text | runtime对应内部流程写入；PK/NOT NULL | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| storage | text | runtime对应内部流程写入；PK/NOT NULL | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| table_name | text | runtime对应内部流程写入；PK/NOT NULL | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| column_name | text | runtime对应内部流程写入；nullable/default见migration | 实体到SQL表列的schema元数据/类型/索引/约束；非业务记录 | 读：Montana runtime attrs；写：Montana runtime attrs |
| inserted_at | utc_datetime_usec | framework-generated；migration macro | 后台主键/时间 | 读：runtime；写：runtime |
| updated_at | utc_datetime_usec | framework-generated；migration macro | 后台主键/时间 | 读：runtime；写：runtime |
| search_indexed | boolean | 可选trigram搜索索引声明；NOT NULL | 可选trigram搜索索引声明 | 读：Montana runtime attrs；写：Montana runtime attrs |
| vector_dimensions | integer | 可选pgvector维度声明；nullable | 可选pgvector维度声明 | 读：Montana runtime attrs；写：Montana runtime attrs |
| column_type | text | SQL introspection列类型映射；nullable | SQL introspection列类型映射 | 读：Montana runtime attrs；写：Montana runtime attrs |

关系： → system.apps.id。

索引：create unique_index(:attrs, [:app_id, :fwd_etype, :fwd_label], prefix: system_schema())；create unique_index(:attrs, [:app_id, :rev_etype, :rev_label],。

### runtime:refresh_tokens · refresh_tokens

runtime_sql_support → physical:runtime:refresh_tokens。Auth会话SHA256 token；微信mint/登录/退出/socket身份

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| token_hash | binary | runtime对应内部流程写入；PK/NOT NULL | Auth会话SHA256 token；微信mint/登录/退出/socket身份 | 读：Montana runtime refresh_tokens；写：Montana runtime refresh_tokens |
| app_id | text FK system.apps.id | runtime对应内部流程写入；PK/NOT NULL | Auth会话SHA256 token；微信mint/登录/退出/socket身份 | 读：Montana runtime refresh_tokens；写：Montana runtime refresh_tokens |
| user_id | text | runtime对应内部流程写入；PK/NOT NULL | Auth会话SHA256 token；微信mint/登录/退出/socket身份 | 读：Montana runtime refresh_tokens；写：Montana runtime refresh_tokens |
| inserted_at | utc_datetime_usec | runtime对应内部流程写入；PK/NOT NULL | Auth会话SHA256 token；微信mint/登录/退出/socket身份 | 读：Montana runtime refresh_tokens；写：Montana runtime refresh_tokens |

关系： → system.apps.id;  → $users.id。

索引：create index(:refresh_tokens, [:app_id, :user_id], prefix: system_schema())。

### runtime:magic_codes · magic_codes

runtime_sql_support → physical:runtime:magic_codes。邮件手机统一recipient验证码hash/过期/次数；旧email rename

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| app_id | text FK system.apps.id | runtime对应内部流程写入；PK/NOT NULL | 邮件手机统一recipient验证码hash/过期/次数；旧email rename | 读：Montana runtime magic_codes；写：Montana runtime magic_codes |
| recipient | text | runtime对应内部流程写入；PK/NOT NULL | 邮件手机统一recipient验证码hash/过期/次数；旧email rename | 读：Montana runtime magic_codes；写：Montana runtime magic_codes |
| code_hash | binary | runtime对应内部流程写入；PK/NOT NULL | 邮件手机统一recipient验证码hash/过期/次数；旧email rename | 读：Montana runtime magic_codes；写：Montana runtime magic_codes |
| expires_at | utc_datetime_usec | runtime对应内部流程写入；PK/NOT NULL | 邮件手机统一recipient验证码hash/过期/次数；旧email rename | 读：Montana runtime magic_codes；写：Montana runtime magic_codes |
| attempts | integer | runtime对应内部流程写入；PK/NOT NULL | 邮件手机统一recipient验证码hash/过期/次数；旧email rename | 读：Montana runtime magic_codes；写：Montana runtime magic_codes |
| consumed | boolean | runtime对应内部流程写入；PK/NOT NULL | 邮件手机统一recipient验证码hash/过期/次数；旧email rename | 读：Montana runtime magic_codes；写：Montana runtime magic_codes |
| inserted_at | utc_datetime_usec | runtime对应内部流程写入；PK/NOT NULL | 邮件手机统一recipient验证码hash/过期/次数；旧email rename | 读：Montana runtime magic_codes；写：Montana runtime magic_codes |
| id | default SQL PK | framework-generated；migration macro | 后台主键/时间 | 读：runtime；写：runtime |

关系： → system.apps.id。

索引：create index(:magic_codes, [:app_id, :email, :inserted_at], prefix: system_schema())；email索引列随rename成recipient；当前索引名未查。

### runtime:upload_urls · upload_urls

runtime_sql_support → physical:runtime:upload_urls。Storage一次性上传路径/时限能力；非media表

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text | runtime对应内部流程写入；PK/NOT NULL | Storage一次性上传路径/时限能力；非media表 | 读：Montana runtime upload_urls；写：Montana runtime upload_urls |
| app_id | text FK system.apps.id | runtime对应内部流程写入；PK/NOT NULL | Storage一次性上传路径/时限能力；非media表 | 读：Montana runtime upload_urls；写：Montana runtime upload_urls |
| path | text | runtime对应内部流程写入；PK/NOT NULL | Storage一次性上传路径/时限能力；非media表 | 读：Montana runtime upload_urls；写：Montana runtime upload_urls |
| expires_at | utc_datetime_usec | runtime对应内部流程写入；PK/NOT NULL | Storage一次性上传路径/时限能力；非media表 | 读：Montana runtime upload_urls；写：Montana runtime upload_urls |
| replace | boolean | 是否允许覆盖已有文件；Storage.create_upload_url写入，consume_upload_url读取并删除一次性能力；5分钟TTL；NOT NULL | 是否允许覆盖已有文件；Storage.create_upload_url写入，consume_upload_url读取并删除一次性能力；5分钟TTL | 读：Montana runtime upload_urls；写：Montana runtime upload_urls |

关系： → system.apps.id。

索引：create index(:upload_urls, [:expires_at], prefix: system_schema())。

### runtime:function_deployments · function_deployments

runtime_sql_support → physical:runtime:function_deployments。Functions代码/manifest版本，community exports部署容器

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| app_id | text FK system.apps.id | runtime对应内部流程写入；PK/NOT NULL | Functions代码/manifest版本，community exports部署容器 | 读：Montana runtime function_deployments；写：Montana runtime function_deployments |
| version | integer | runtime对应内部流程写入；PK/NOT NULL | Functions代码/manifest版本，community exports部署容器 | 读：Montana runtime function_deployments；写：Montana runtime function_deployments |
| code | text | runtime对应内部流程写入；PK/NOT NULL | Functions代码/manifest版本，community exports部署容器 | 读：Montana runtime function_deployments；写：Montana runtime function_deployments |
| manifest | map | runtime对应内部流程写入；PK/NOT NULL | Functions代码/manifest版本，community exports部署容器 | 读：Montana runtime function_deployments；写：Montana runtime function_deployments |
| inserted_at | utc_datetime_usec | runtime对应内部流程写入；PK/NOT NULL | Functions代码/manifest版本，community exports部署容器 | 读：Montana runtime function_deployments；写：Montana runtime function_deployments |

关系： → system.apps.id。

索引：主键见字段；其他迁移扩展未穷举。

### runtime:function_env · function_env

runtime_sql_support → physical:runtime:function_env。Functions环境字段；value可含密钥，只记字段名，不读取实际值

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| app_id | text FK system.apps.id | runtime对应内部流程写入；PK/NOT NULL | Functions环境字段；value可含密钥，只记字段名，不读取实际值 | 读：Montana runtime function_env；写：Montana runtime function_env |
| name | text | runtime对应内部流程写入；PK/NOT NULL | Functions环境字段；value可含密钥，只记字段名，不读取实际值 | 读：Montana runtime function_env；写：Montana runtime function_env |
| value | text | runtime对应内部流程写入；PK/NOT NULL | Functions环境字段；value可含密钥，只记字段名，不读取实际值 | 读：Montana runtime function_env；写：Montana runtime function_env |
| updated_at | utc_datetime_usec | runtime对应内部流程写入；PK/NOT NULL | Functions环境字段；value可含密钥，只记字段名，不读取实际值 | 读：Montana runtime function_env；写：Montana runtime function_env |

关系： → system.apps.id。

索引：主键见字段；其他迁移扩展未穷举。

### runtime:function_logs · function_logs

runtime_sql_support → physical:runtime:function_logs。Functions后台调用结果/错误日志；无用户页面不等于不用

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| app_id | text FK system.apps.id | runtime对应内部流程写入；PK/NOT NULL | Functions后台调用结果/错误日志；无用户页面不等于不用 | 读：Montana runtime function_logs；写：Montana runtime function_logs |
| name | text | runtime对应内部流程写入；PK/NOT NULL | Functions后台调用结果/错误日志；无用户页面不等于不用 | 读：Montana runtime function_logs；写：Montana runtime function_logs |
| kind | text | runtime对应内部流程写入；PK/NOT NULL | Functions后台调用结果/错误日志；无用户页面不等于不用 | 读：Montana runtime function_logs；写：Montana runtime function_logs |
| ok | boolean | runtime对应内部流程写入；PK/NOT NULL | Functions后台调用结果/错误日志；无用户页面不等于不用 | 读：Montana runtime function_logs；写：Montana runtime function_logs |
| error | text | runtime对应内部流程写入；nullable/default见migration | Functions后台调用结果/错误日志；无用户页面不等于不用 | 读：Montana runtime function_logs；写：Montana runtime function_logs |
| duration_ms | integer | runtime对应内部流程写入；PK/NOT NULL | Functions后台调用结果/错误日志；无用户页面不等于不用 | 读：Montana runtime function_logs；写：Montana runtime function_logs |
| logs | map | runtime对应内部流程写入；nullable/default见migration | Functions后台调用结果/错误日志；无用户页面不等于不用 | 读：Montana runtime function_logs；写：Montana runtime function_logs |
| inserted_at | utc_datetime_usec | runtime对应内部流程写入；PK/NOT NULL | Functions后台调用结果/错误日志；无用户页面不等于不用 | 读：Montana runtime function_logs；写：Montana runtime function_logs |
| id | default SQL PK | framework-generated；migration macro | 后台主键/时间 | 读：runtime；写：runtime |

关系： → system.apps.id。

索引：create index(:function_logs, [:app_id, :inserted_at], prefix: s)。

### runtime:scheduled_jobs · scheduled_jobs

runtime_sql_support → physical:runtime:scheduled_jobs。Scheduler报名支付到期/失败重排，action包含函数名与args

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| id | text | runtime对应内部流程写入；PK/NOT NULL | Scheduler报名支付到期/失败重排，action包含函数名与args | 读：Montana runtime scheduled_jobs；写：Montana runtime scheduled_jobs |
| app_id | text FK system.apps.id | runtime对应内部流程写入；PK/NOT NULL | Scheduler报名支付到期/失败重排，action包含函数名与args | 读：Montana runtime scheduled_jobs；写：Montana runtime scheduled_jobs |
| cron_name | text | runtime对应内部流程写入；nullable/default见migration | Scheduler报名支付到期/失败重排，action包含函数名与args | 读：Montana runtime scheduled_jobs；写：Montana runtime scheduled_jobs |
| action | map | runtime对应内部流程写入；PK/NOT NULL | Scheduler报名支付到期/失败重排，action包含函数名与args | 读：Montana runtime scheduled_jobs；写：Montana runtime scheduled_jobs |
| run_at | utc_datetime_usec | runtime对应内部流程写入；PK/NOT NULL | Scheduler报名支付到期/失败重排，action包含函数名与args | 读：Montana runtime scheduled_jobs；写：Montana runtime scheduled_jobs |
| state | text | runtime对应内部流程写入；PK/NOT NULL | Scheduler报名支付到期/失败重排，action包含函数名与args | 读：Montana runtime scheduled_jobs；写：Montana runtime scheduled_jobs |
| error | text | runtime对应内部流程写入；nullable/default见migration | Scheduler报名支付到期/失败重排，action包含函数名与args | 读：Montana runtime scheduled_jobs；写：Montana runtime scheduled_jobs |
| result | map | runtime对应内部流程写入；nullable/default见migration | Scheduler报名支付到期/失败重排，action包含函数名与args | 读：Montana runtime scheduled_jobs；写：Montana runtime scheduled_jobs |
| started_at | utc_datetime_usec | runtime对应内部流程写入；nullable/default见migration | Scheduler报名支付到期/失败重排，action包含函数名与args | 读：Montana runtime scheduled_jobs；写：Montana runtime scheduled_jobs |
| completed_at | utc_datetime_usec | runtime对应内部流程写入；nullable/default见migration | Scheduler报名支付到期/失败重排，action包含函数名与args | 读：Montana runtime scheduled_jobs；写：Montana runtime scheduled_jobs |
| inserted_at | utc_datetime_usec | runtime对应内部流程写入；PK/NOT NULL | Scheduler报名支付到期/失败重排，action包含函数名与args | 读：Montana runtime scheduled_jobs；写：Montana runtime scheduled_jobs |

关系： → system.apps.id。

索引：create index(:scheduled_jobs, [:run_at], prefix: s, where: "state = 'pending'")；create index(:scheduled_jobs, [:app_id, :run_at], prefix: s)；create index(:scheduled_jobs, [:completed_at], prefix: s)。

### runtime:cron_jobs · cron_jobs

runtime_sql_support → physical:runtime:cron_jobs。Scheduler周期能力；community源码未注册cron，不宣称已启用任务

| 字段 | 类型 | 必填/约束 | 用途 | 读/写入口 |
| --- | --- | --- | --- | --- |
| app_id | text FK system.apps.id | runtime对应内部流程写入；PK/NOT NULL | Scheduler周期能力；community源码未注册cron，不宣称已启用任务 | 读：Montana runtime cron_jobs；写：Montana runtime cron_jobs |
| name | text | runtime对应内部流程写入；PK/NOT NULL | Scheduler周期能力；community源码未注册cron，不宣称已启用任务 | 读：Montana runtime cron_jobs；写：Montana runtime cron_jobs |
| schedule | map | runtime对应内部流程写入；PK/NOT NULL | Scheduler周期能力；community源码未注册cron，不宣称已启用任务 | 读：Montana runtime cron_jobs；写：Montana runtime cron_jobs |
| action | map | runtime对应内部流程写入；PK/NOT NULL | Scheduler周期能力；community源码未注册cron，不宣称已启用任务 | 读：Montana runtime cron_jobs；写：Montana runtime cron_jobs |
| next_run_at | utc_datetime_usec | runtime对应内部流程写入；PK/NOT NULL | Scheduler周期能力；community源码未注册cron，不宣称已启用任务 | 读：Montana runtime cron_jobs；写：Montana runtime cron_jobs |
| last_run_at | utc_datetime_usec | runtime对应内部流程写入；nullable/default见migration | Scheduler周期能力；community源码未注册cron，不宣称已启用任务 | 读：Montana runtime cron_jobs；写：Montana runtime cron_jobs |
| inserted_at | utc_datetime_usec | framework-generated；migration macro | 后台主键/时间 | 读：runtime；写：runtime |
| updated_at | utc_datetime_usec | framework-generated；migration macro | 后台主键/时间 | 读：runtime；写：runtime |

关系： → system.apps.id。

索引：create index(:cron_jobs, [:next_run_at], prefix: s)。

## 核心源码入口

- `server/lib/montana/schema/migrator.ex:153` / `:180`、`schema/ddl.ex:22`：真实SQL表列映射。
- `apps/community706/functions/community.ts:16` / `:22`：data展开与共同列保存。
- `apps/community706/deploy.py:32`：索引增补意图，未执行。
- `server/lib/montana/schema.ex:93` / `:100`、`storage.ex:65`：系统账户/文件字段。
- JSON每字段 sourceEvidence/evidence给出具体文件与行号；runtime表来自对应SQL migrations。

未查询当前数据库；清单描述源码/历史定义的结构，不宣称当前生产字段存在或业务运行通过。
