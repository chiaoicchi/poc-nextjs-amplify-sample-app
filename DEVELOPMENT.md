# 開発方法

## 環境整備 (Mac 編)

`homebrew`(<https://brew.sh/>) がはいっていることを前提とします。

### `git` のインストール

```bash
% brew install git
```

### `node` のインストール

`node`(<https://nodejs.org/en>) 関連の一才が入っていないことを仮定します。
もし入っている場合は、それを用いるか、削除して入れ直してください。バージョンが異なることによる CE などは、対応しません。
`Volta`(<https://volta.sh/>) を使用してバージョン管理を行います。

`node` を直接 `brew` でインストールすることも可能ですが、 `/usr/local/bin` にインストールされます。
ここは `user` の権限が変わっており、 `npm` 系のコマンドで問題が生じる場合があります。
また、バージョンの管理がしやすく、バージョン管理ツールを使用することをお勧めします。
ちなみに、 `Volta` は `Rust` で作られています。 `Rust` はいいぞ！！！

```bash
% brew install volta
% volta setup
% volta --version
2.0.2 # この部分は、異なる可能性があります。バージョンが出力されることを確認してください。
```

これで、`Volta` のインストールができました。これを使用して、特定のバージョンの `node` をインストールします。
一旦、 `Volta` の設定を反映させるためにターミナルを再起動させましょう。

```bash
% volta install node@20 # 新しすぎると amplify がうまく動きません。
% node -v
v20.19.4
% which node
/Users/<ユーザー名>/.volta/bin/node
% npm -v
11.5.1
```

`which node` コマンドの結果から、ユーザーの権限のある場所にインストールされていることが確認できます。
また、 `npm` も同時にインストールされます。

### `awscli` のインストール

```bash
% brew install awscli
```

これをおこなうことで、インストールできます。

```bash
% aws --v
aws-cli/2.27.50 Python/3.13.5 Darwin/23.5.0 source/arm64
```

これにともなって、 Python などもインストールされます。

## nextjs の初期ディレクトリ構成を作成する

まずは、 `next.js` 部分を作成します。以下のコマンドを使用します。

```bash
% npx create-next-app@latest poc-nextjs-amplift-sample --ts --app --eslint --tailwind
✔ Would you like your code inside a `src/` directory? … No
✔ Would you like to use Turbopack for `next dev`? … No
✔ Would you like to customize the import alias (`@/*` by default)? … No
```

このコマンドを使用すると、以下のようなフォルダ構成となります。

```	
app                 # フロンドエンドに関するコードなど。
├─ favicon.ico      # ブラウザのタブやブックマークに表示されるアイコン。
├─ globals.css      # 全体の css 設定。
├─ layout.tsx       # 全体のレイアウトのコード。
└─ pages.tsx	    # トップページ用のコード。
next-env.d.ts		# next.js 用の型定義ファイル。
node_modules        # node に使用されているライブラリ。
└─ ...
package.json		# 全体の依存の設定。
public              # 画像などの静的なファイル置き場。
└─ ...              
README.md           # 自動生成される README ファイル。
eslint.config.mjs   # TypeScript 用のリンター設定。
next.config.ts		# next.js の設定ファイル。
package-lock.json   # 全体の依存のロックファイル。これによって、使用されるライブラリが固定される。
postcss.config.mjs	# 今回は使用しません。知らないファイルです。
tsconfig.json       # TypeScript の設定ファイル。
```

この状態でビルドしてみます。
ビルドするとは、現在リポジトリにあるコードを実際にパソコンが実行できる形に変換することです。
その後、そのまま実行します。
`npm` を使用すると実行までを一連の流れで行うことができます。

```bash
% npm run dev
```

これを実行すると、アプリケーションは <http://localhost:3000> にて公開されます。
試しにアクセスしてみましょう。

## Amplify 側の設定をおこなう

```bash
% npm create amplify@latest
```

`amplify` ディレクトリが作成されます。

```
amplify             # バックエンドに関するコードなど。
├─ auth             # 認証に関するコード。
│   └─ resource.ts
├─ backend.ts       # バックエンド全体を設定するコード。
├─ data             # データベースに関するコード。
│   └─ resource.ts
├─ package.json     # バックエンド側の設定ファイル。
└─ tsconfig.json    # TypeScript の設定ファイル。
```

## 最初のデプロイをする

これまで作成してきた初期アプリを Amplify gen 2 でデプロイします。

今回は、Github レポジトリと連携させます。
そこで、これまで作成してきたものを Github にプッシュします。
実は、 `npx` で最初の `nextjs` アプリを作成すると、それ自体が commit された状態として `.git` が作成されます。
なので、それ以降の変更の部分をコミットしてプッシュします。

Github レポジトリを作成する部分は省略します。

```bash
% git add .
% git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   .gitignore
	new file:   amplify/auth/resource.ts
	new file:   amplify/backend.ts
	new file:   amplify/data/resource.ts
	new file:   amplify/package.json
	new file:   amplify/tsconfig.json
	modified:   package-lock.json
	modified:   package.json
% git commit -m "Initial settings of amplify"
% git branch -M main
% git remote add origin <URL>
% git push origin main
```

これで、プッシュできました。実際に、レポジトリをみて確認してみましょう。

つぎに、マネジメントコンソールから Amplify の設定をします。
ビルドにかなりの時間がかかります。
さて、表示されている URL にアクセスしてみましょう。 NEXT.js の初期画面が出てくると思います。

自動作成されたリソースを見てみます。

DynamoDB テーブルと Cognito ユーザープールが作成されていることが確認できます。
これらは、 Amplify によって自動で作成されます。

# 開発を進める

## サンプルをコピーする

TODO アプリのサンプルをコピーします。
<https://github.com/aws-samples/amplify-next-template> にあるサンプル (`app/`) をコピーしました。
好みの理由で、 Tailwind 調にしました。


## `amplify.yml, amplify_output.json` をダウンロードする

ローカルでの開発を有効に進めたいです。そこで、 `amplify.yml, amplify_output.json` をダウンロードします。
これは、 `main` ブランチに新しいコミットがプッシュされた際に、どのようにリリースされたアプリを更新するかの設定ファイルです。

```bash
% mv ~/Downloads/amplify.yml ./
% mv ~/Downloads/amplify_outputs.json ./
```

これで、トップに `amplify.yml, amplify_output.json` ができました。

## データを削除する機能を追加する

1 つの TODO コンポーネントにクリックすると発火する削除関数を実装します。

```TypeScript
# 22 ~ 24 行目
function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
}

# 49 行目
onClick={() => deleteTodo(todo.id)}
```

Github に変更をコミットします。

```bash
% git add app/
% git commit -m "add delete func"
% git push origin main
```

`main` ブランチへのコミットが検知され、再デプロイが始まりました。
再デプロイ中もすでにデプロイされている古いアプリへアクセスができるので、サービスのダウンタイムが発生しないように更新されていることがわかります。

# Cloud Sandbox

## アクセスキーの設定

AdministratorAccess のポリシーをもった IAM ユーザーを作成します。
アクセスキーも作成し、

```bash
% aws configure
AWS Access Key ID [None]: <でてきたアクセスキー>
AWS Secret Access Key [None]: <でてきたシークレットアクセスキー>
Default region name [None]: ap-northeast-1
Default output format [None]: json
```

として、登録します。これらのキーを Github であげたりなど公開してはいけません。
configure コマンドを使うことで、 `~/.aws/credentials` に保存されます。
このファイルは AWSCLI での認証時に勝手に見に行ってくれる設定ファイルです。

```bash
% aws s3 ls
```

などのコマンドでアクセスできるかが確認できます。

## Cloud Sandbox のデプロイ

```bash
% npx ampx sandbox
8:48:11 AM [Sandbox] Pattern !.yarn/patches found in .gitignore. ".yarn/patches" will not be watched if other patterns in .gitignore are excluding it.
8:48:11 AM [Sandbox] Pattern !.yarn/plugins found in .gitignore. ".yarn/plugins" will not be watched if other patterns in .gitignore are excluding it.
8:48:11 AM [Sandbox] Pattern !.yarn/releases found in .gitignore. ".yarn/releases" will not be watched if other patterns in .gitignore are excluding it.
8:48:11 AM [Sandbox] Pattern !.yarn/versions found in .gitignore. ".yarn/versions" will not be watched if other patterns in .gitignore are excluding it.


  Amplify Sandbox

  Identifier: 	<名前>
  Stack: 	<サンドボックス名>
  Region: 	ap-northeast-1

  To specify a different sandbox identifier, use --identifier

8:48:13 AM WARNING: Schema is using an @auth directive with deprecated provider 'iam'. Replace 'iam' provider with 'identityPool' provider.
8:48:13 AM
8:48:13 AM ✔ Backend synthesized in 2.04 seconds
8:48:18 AM ✔ Type checks completed in 5 seconds
8:48:19 AM ✔ Built and published assets
8:51:53 AM ✔ Deployment completed in 213.671 seconds
8:51:53 AM AppSync API endpoint = <エンドポイント名>
8:51:53 AM [Sandbox] Watching for file changes...
8:51:54 AM File written: amplify_outputs.json
```

このメッセージを見て気づきましたが、 GraphQL ベースのアプリケーションになっていたんですね。
App Sync を用いてデプロイされているようです。

App Sync - Cognito, DynamoDB, S3

の構成がとられています。フロントエンドで削除関数を実装したときに、 GraphQL のスキーマが生成されていたようです。自動生成機能が嬉しいですね。

Cloud Sandbox とは、App Sync, Cognito, DynamoDB, S3 の部分を AWS 上で実際にテストできる機能のようです。

## 認証機能の追加

ログインする際に認証をするようにします。

その前に、既存の認証方法を変える必要があります。

```ts
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
```

guest ログインであったものを API key によるログインにします。
<https://github.com/aws-samples/amplify-next-template/blob/main/amplify/data/resource.ts> に揃えるような形です。
amplify コマンドを使用して自動作成すると最初からこの形にならないようで、ハマりました。
この変更をすると、 Cloud Sandbox リソースが更新されます。この更新が長くて辛い気持ちにになります。
TODO の閲覧権限をどのように許可するかで、ゲストにのみ許可しているとログインした際に見ることができなくなります。
`publicApiKey()` にすることで、API Key によるログイン者が TODO を閲覧することを許します。

```ts
"use client"

import { Authenticator } from "@aws-amplify/ui-react";

export default function AuthenticatorWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Authenticator>{children}</Authenticator>;
}
```

を `app/AuthenticatorWrapper.tsx` として作成し、 `app/layout.tsx` でインポートします。

```ts
import AuthenticatorWrapper from "./AuthenticatorWrapper";
import "@aws-amplify/ui-react/styles.css";

    
    <html lang="en">
      <body>      
        <AuthenticatorWrapper>
          {children}
        </AuthenticatorWrapper>
      </body>
    </html>
```

これで認証が試せるようにになりました。
サインアウトも実装します。
これを実装しないと次にサインインの実験をするために、キャッシュを削除するか 30 日待つ必要が出てきます。

```ts
import { useAuthenticator } from "@aws-amplify/ui-react";
  
  const { signOut } = useAuthenticator();

        <button onClick={signOut}>Sign out</button>
```

これらを `app/pages.tsx` に実装します。

Github にコミットをすると変更がアプリにも反映されます。

## Cloud Sandbox を削除する

Cloud Sandbox にも有料のリソースが使われているので逐一削除した方が良いです。

```bash
% npx ampx sandbox delete
```
