/* tslint:disable */
import { GraphQLResolveInfo } from 'graphql';

export type QueryResolver<Result, Parent = any, Context = any, Args = any> = (
  parent?: Parent,
  args?: Args,
  context?: Context,
  info?: GraphQLResolveInfo
) => Promise<Result> | Result;

export type SubscriptionResolver<Result, Parent = any, Context = any, Args = any> = {
  subscribe<R = Result, P = Parent>(
    parent?: P,
    args?: Args,
    context?: Context,
    info?: GraphQLResolveInfo
  ): AsyncIterator<R | Result>;
  resolve?<R = Result, P = Parent>(
    parent?: P,
    args?: Args,
    context?: Context,
    info?: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
};

export type Resolver<Result, Parent = any, Context = any, Args = any> =
  | QueryResolver<Result, Parent, Context, Args>
  | SubscriptionResolver<Result, Parent, Context, Args>;

export interface Query {
  feed?: (Entry | null)[] | null /** A feed of repository submissions */;
  entry?: Entry | null /** A single entry */;
  currentUser?: User | null /** Return the currently logged in user, or null if nobody is logged in */;
}
/** Information about a GitHub repository submitted to GitHunt */
export interface Entry {
  repository: Repository /** Information about the repository from GitHub */;
  postedBy: User /** The GitHub user who submitted this entry */;
  createdAt: number /** A timestamp of when the entry was submitted */;
  score: number /** The score of this repository, upvotes - downvotes */;
  hotScore: number /** The hot score of this repository */;
  comments: (Comment | null)[] /** Comments posted about this repository */;
  commentCount: number /** The number of comments posted about this repository */;
  id: number /** The SQL ID of this entry */;
  vote: Vote /** XXX to be changed */;
}
/** A repository object from the GitHub API. This uses the exact field names returned by theGitHub API for simplicity, even though the convention for GraphQL is usually to camel case. */
export interface Repository {
  name: string /** Just the name of the repository, e.g. GitHunt-API */;
  full_name: string /** The full name of the repository with the username, e.g. apollostack/GitHunt-API */;
  description?: string | null /** The description of the repository */;
  html_url: string /** The link to the repository on GitHub */;
  stargazers_count: number /** The number of people who have starred this repository on GitHub */;
  open_issues_count?: number | null /** The number of open issues on this repository on GitHub */;
  owner?: User | null /** The owner of this repository on GitHub, e.g. apollostack */;
}
/** A user object from the GitHub API. This uses the exact field names returned from the GitHub API. */
export interface User {
  login: string /** The name of the user, e.g. apollostack */;
  avatar_url: string /** The URL to a directly embeddable image for this user's avatar */;
  html_url: string /** The URL of this user's GitHub page */;
}
/** A comment about an entry, submitted by a user */
export interface Comment {
  id: number /** The SQL ID of this entry */;
  postedBy: User /** The GitHub user who posted the comment */;
  createdAt: number /** A timestamp of when the comment was posted */;
  content: string /** The text of the comment */;
  repoName: string /** The repository which this comment is about */;
}
/** XXX to be removed */
export interface Vote {
  vote_value: number;
}

export interface Mutation {
  submitRepository?: Entry | null /** Submit a new repository, returns the new submission */;
  vote?: Entry | null /** Vote on a repository submission, returns the submission that was voted on */;
  submitComment?: Comment | null /** Comment on a repository, returns the new comment */;
}

export interface Subscription {
  commentAdded?: Comment | null /** Subscription fires on every comment added */;
}
export interface FeedQueryArgs {
  type: FeedType /** The sort order for the feed */;
  offset?: number | null /** The number of items to skip, for pagination */;
  limit?: number | null /** The number of items to fetch starting from the offset, for pagination */;
}
export interface EntryQueryArgs {
  repoFullName: string /** The full repository name from GitHub, e.g. "apollostack/GitHunt-API" */;
}
export interface CommentsEntryArgs {
  limit?: number | null;
  offset?: number | null;
}
export interface SubmitRepositoryMutationArgs {
  repoFullName: string /** The full repository name from GitHub, e.g. "apollostack/GitHunt-API" */;
}
export interface VoteMutationArgs {
  repoFullName: string /** The full repository name from GitHub, e.g. "apollostack/GitHunt-API" */;
  type: VoteType /** The type of vote - UP, DOWN, or CANCEL */;
}
export interface SubmitCommentMutationArgs {
  repoFullName: string /** The full repository name from GitHub, e.g. "apollostack/GitHunt-API" */;
  commentContent: string /** The text content for the new comment */;
}
export interface CommentAddedSubscriptionArgs {
  repoFullName: string;
}
/** A list of options for the sort order of the feed */
export enum FeedType {
  HOT = 'HOT',
  NEW = 'NEW',
  TOP = 'TOP'
}
/** The type of vote to record, when submitting a vote */
export enum VoteType {
  UP = 'UP',
  DOWN = 'DOWN',
  CANCEL = 'CANCEL'
}

export namespace QueryResolvers {
  export interface Resolvers<Context = any, Parent = Query> {
    feed?: FeedResolver<(Entry | null)[] | null, Parent, Context> /** A feed of repository submissions */;
    entry?: EntryResolver<Entry | null, Parent, Context> /** A single entry */;
    currentUser?: CurrentUserResolver<
      User | null,
      Parent,
      Context
    > /** Return the currently logged in user, or null if nobody is logged in */;
  }

  export type FeedResolver<R = (Entry | null)[] | null, Parent = Query, Context = any> = Resolver<
    R,
    Parent,
    Context,
    FeedArgs
  >;
  export interface FeedArgs {
    type: FeedType /** The sort order for the feed */;
    offset?: number | null /** The number of items to skip, for pagination */;
    limit?: number | null /** The number of items to fetch starting from the offset, for pagination */;
  }

  export type EntryResolver<R = Entry | null, Parent = Query, Context = any> = Resolver<R, Parent, Context, EntryArgs>;
  export interface EntryArgs {
    repoFullName: string /** The full repository name from GitHub, e.g. "apollostack/GitHunt-API" */;
  }

  export type CurrentUserResolver<R = User | null, Parent = Query, Context = any> = Resolver<R, Parent, Context>;
}
/** Information about a GitHub repository submitted to GitHunt */
export namespace EntryResolvers {
  export interface Resolvers<Context = any, Parent = Entry> {
    repository?: RepositoryResolver<Repository, Parent, Context> /** Information about the repository from GitHub */;
    postedBy?: PostedByResolver<User, Parent, Context> /** The GitHub user who submitted this entry */;
    createdAt?: CreatedAtResolver<number, Parent, Context> /** A timestamp of when the entry was submitted */;
    score?: ScoreResolver<number, Parent, Context> /** The score of this repository, upvotes - downvotes */;
    hotScore?: HotScoreResolver<number, Parent, Context> /** The hot score of this repository */;
    comments?: CommentsResolver<(Comment | null)[], Parent, Context> /** Comments posted about this repository */;
    commentCount?: CommentCountResolver<
      number,
      Parent,
      Context
    > /** The number of comments posted about this repository */;
    id?: IdResolver<number, Parent, Context> /** The SQL ID of this entry */;
    vote?: VoteResolver<Vote, Parent, Context> /** XXX to be changed */;
  }

  export type RepositoryResolver<R = Repository, Parent = Entry, Context = any> = Resolver<R, Parent, Context>;
  export type PostedByResolver<R = User, Parent = Entry, Context = any> = Resolver<R, Parent, Context>;
  export type CreatedAtResolver<R = number, Parent = Entry, Context = any> = Resolver<R, Parent, Context>;
  export type ScoreResolver<R = number, Parent = Entry, Context = any> = Resolver<R, Parent, Context>;
  export type HotScoreResolver<R = number, Parent = Entry, Context = any> = Resolver<R, Parent, Context>;
  export type CommentsResolver<R = (Comment | null)[], Parent = Entry, Context = any> = Resolver<
    R,
    Parent,
    Context,
    CommentsArgs
  >;
  export interface CommentsArgs {
    limit?: number | null;
    offset?: number | null;
  }

  export type CommentCountResolver<R = number, Parent = Entry, Context = any> = Resolver<R, Parent, Context>;
  export type IdResolver<R = number, Parent = Entry, Context = any> = Resolver<R, Parent, Context>;
  export type VoteResolver<R = Vote, Parent = Entry, Context = any> = Resolver<R, Parent, Context>;
}
/** A repository object from the GitHub API. This uses the exact field names returned by theGitHub API for simplicity, even though the convention for GraphQL is usually to camel case. */
export namespace RepositoryResolvers {
  export interface Resolvers<Context = any, Parent = Repository> {
    name?: NameResolver<string, Parent, Context> /** Just the name of the repository, e.g. GitHunt-API */;
    full_name?: FullNameResolver<
      string,
      Parent,
      Context
    > /** The full name of the repository with the username, e.g. apollostack/GitHunt-API */;
    description?: DescriptionResolver<string | null, Parent, Context> /** The description of the repository */;
    html_url?: HtmlUrlResolver<string, Parent, Context> /** The link to the repository on GitHub */;
    stargazers_count?: StargazersCountResolver<
      number,
      Parent,
      Context
    > /** The number of people who have starred this repository on GitHub */;
    open_issues_count?: OpenIssuesCountResolver<
      number | null,
      Parent,
      Context
    > /** The number of open issues on this repository on GitHub */;
    owner?: OwnerResolver<User | null, Parent, Context> /** The owner of this repository on GitHub, e.g. apollostack */;
  }

  export type NameResolver<R = string, Parent = Repository, Context = any> = Resolver<R, Parent, Context>;
  export type FullNameResolver<R = string, Parent = Repository, Context = any> = Resolver<R, Parent, Context>;
  export type DescriptionResolver<R = string | null, Parent = Repository, Context = any> = Resolver<R, Parent, Context>;
  export type HtmlUrlResolver<R = string, Parent = Repository, Context = any> = Resolver<R, Parent, Context>;
  export type StargazersCountResolver<R = number, Parent = Repository, Context = any> = Resolver<R, Parent, Context>;
  export type OpenIssuesCountResolver<R = number | null, Parent = Repository, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type OwnerResolver<R = User | null, Parent = Repository, Context = any> = Resolver<R, Parent, Context>;
}
/** A user object from the GitHub API. This uses the exact field names returned from the GitHub API. */
export namespace UserResolvers {
  export interface Resolvers<Context = any, Parent = User> {
    login?: LoginResolver<string, Parent, Context> /** The name of the user, e.g. apollostack */;
    avatar_url?: AvatarUrlResolver<
      string,
      Parent,
      Context
    > /** The URL to a directly embeddable image for this user's avatar */;
    html_url?: HtmlUrlResolver<string, Parent, Context> /** The URL of this user's GitHub page */;
  }

  export type LoginResolver<R = string, Parent = User, Context = any> = Resolver<R, Parent, Context>;
  export type AvatarUrlResolver<R = string, Parent = User, Context = any> = Resolver<R, Parent, Context>;
  export type HtmlUrlResolver<R = string, Parent = User, Context = any> = Resolver<R, Parent, Context>;
}
/** A comment about an entry, submitted by a user */
export namespace CommentResolvers {
  export interface Resolvers<Context = any, Parent = Comment> {
    id?: IdResolver<number, Parent, Context> /** The SQL ID of this entry */;
    postedBy?: PostedByResolver<User, Parent, Context> /** The GitHub user who posted the comment */;
    createdAt?: CreatedAtResolver<number, Parent, Context> /** A timestamp of when the comment was posted */;
    content?: ContentResolver<string, Parent, Context> /** The text of the comment */;
    repoName?: RepoNameResolver<string, Parent, Context> /** The repository which this comment is about */;
  }

  export type IdResolver<R = number, Parent = Comment, Context = any> = Resolver<R, Parent, Context>;
  export type PostedByResolver<R = User, Parent = Comment, Context = any> = Resolver<R, Parent, Context>;
  export type CreatedAtResolver<R = number, Parent = Comment, Context = any> = Resolver<R, Parent, Context>;
  export type ContentResolver<R = string, Parent = Comment, Context = any> = Resolver<R, Parent, Context>;
  export type RepoNameResolver<R = string, Parent = Comment, Context = any> = Resolver<R, Parent, Context>;
}
/** XXX to be removed */
export namespace VoteResolvers {
  export interface Resolvers<Context = any, Parent = Vote> {
    vote_value?: VoteValueResolver<number, Parent, Context>;
  }

  export type VoteValueResolver<R = number, Parent = Vote, Context = any> = Resolver<R, Parent, Context>;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = any, Parent = Mutation> {
    submitRepository?: SubmitRepositoryResolver<
      Entry | null,
      Parent,
      Context
    > /** Submit a new repository, returns the new submission */;
    vote?: VoteResolver<
      Entry | null,
      Parent,
      Context
    > /** Vote on a repository submission, returns the submission that was voted on */;
    submitComment?: SubmitCommentResolver<
      Comment | null,
      Parent,
      Context
    > /** Comment on a repository, returns the new comment */;
  }

  export type SubmitRepositoryResolver<R = Entry | null, Parent = Mutation, Context = any> = Resolver<
    R,
    Parent,
    Context,
    SubmitRepositoryArgs
  >;
  export interface SubmitRepositoryArgs {
    repoFullName: string /** The full repository name from GitHub, e.g. "apollostack/GitHunt-API" */;
  }

  export type VoteResolver<R = Entry | null, Parent = Mutation, Context = any> = Resolver<R, Parent, Context, VoteArgs>;
  export interface VoteArgs {
    repoFullName: string /** The full repository name from GitHub, e.g. "apollostack/GitHunt-API" */;
    type: VoteType /** The type of vote - UP, DOWN, or CANCEL */;
  }

  export type SubmitCommentResolver<R = Comment | null, Parent = Mutation, Context = any> = Resolver<
    R,
    Parent,
    Context,
    SubmitCommentArgs
  >;
  export interface SubmitCommentArgs {
    repoFullName: string /** The full repository name from GitHub, e.g. "apollostack/GitHunt-API" */;
    commentContent: string /** The text content for the new comment */;
  }
}

export namespace SubscriptionResolvers {
  export interface Resolvers<Context = any, Parent = Subscription> {
    commentAdded?: CommentAddedResolver<
      Comment | null,
      Parent,
      Context
    > /** Subscription fires on every comment added */;
  }

  export type CommentAddedResolver<R = Comment | null, Parent = Subscription, Context = any> = Resolver<
    R,
    Parent,
    Context,
    CommentAddedArgs
  >;
  export interface CommentAddedArgs {
    repoFullName: string;
  }
}

export namespace OnCommentAdded {
  export type Variables = {
    repoFullName: string;
  };

  export type Subscription = {
    __typename?: 'Subscription';
    commentAdded?: CommentAdded | null;
  };

  export type CommentAdded = {
    __typename?: 'Comment';
    id: number;
    postedBy: PostedBy;
    createdAt: number;
    content: string;
  };

  export type PostedBy = {
    __typename?: 'User';
    login: string;
    html_url: string;
  };
}

export namespace Comment {
  export type Variables = {
    repoFullName: string;
    limit?: number | null;
    offset?: number | null;
  };

  export type Query = {
    __typename?: 'Query';
    currentUser?: CurrentUser | null;
    entry?: Entry | null;
  };

  export type CurrentUser = {
    __typename?: 'User';
    login: string;
    html_url: string;
  };

  export type Entry = {
    __typename?: 'Entry';
    id: number;
    postedBy: PostedBy;
    createdAt: number;
    comments: (Comments | null)[];
    commentCount: number;
    repository: Repository;
  };

  export type PostedBy = {
    __typename?: 'User';
    login: string;
    html_url: string;
  };

  export type Comments = CommentsPageComment.Fragment;

  export type Repository = {
    __typename?: RepositoryInlineFragment['__typename'];
    full_name: string;
    html_url: string;
  } & (RepositoryInlineFragment);

  export type RepositoryInlineFragment = {
    __typename?: 'Repository';
    description?: string | null;
    open_issues_count?: number | null;
    stargazers_count: number;
  };
}

export namespace CurrentUserForProfile {
  export type Variables = {};

  export type Query = {
    __typename?: 'Query';
    currentUser?: CurrentUser | null;
  };

  export type CurrentUser = {
    __typename?: 'User';
    login: string;
    avatar_url: string;
  };
}

export namespace Feed {
  export type Variables = {
    type: FeedType;
    offset?: number | null;
    limit?: number | null;
  };

  export type Query = {
    __typename?: 'Query';
    currentUser?: CurrentUser | null;
    feed?: (Feed | null)[] | null;
  };

  export type CurrentUser = {
    __typename?: 'User';
    login: string;
  };

  export type Feed = FeedEntry.Fragment;
}

export namespace SubmitRepository {
  export type Variables = {
    repoFullName: string;
  };

  export type Mutation = {
    __typename?: 'Mutation';
    submitRepository?: SubmitRepository | null;
  };

  export type SubmitRepository = {
    __typename?: 'Entry';
    createdAt: number;
  };
}

export namespace SubmitComment {
  export type Variables = {
    repoFullName: string;
    commentContent: string;
  };

  export type Mutation = {
    __typename?: 'Mutation';
    submitComment?: SubmitComment | null;
  };

  export type SubmitComment = CommentsPageComment.Fragment;
}

export namespace Vote {
  export type Variables = {
    repoFullName: string;
    type: VoteType;
  };

  export type Mutation = {
    __typename?: 'Mutation';
    vote?: Vote | null;
  };

  export type Vote = {
    __typename?: 'Entry';
    score: number;
    id: number;
    vote: Vote;
  };

  export type _Vote = {
    __typename?: 'Vote';
    vote_value: number;
  };
}

export namespace CommentsPageComment {
  export type Fragment = {
    __typename?: 'Comment';
    id: number;
    postedBy: PostedBy;
    createdAt: number;
    content: string;
  };

  export type PostedBy = {
    __typename?: 'User';
    login: string;
    html_url: string;
  };
}

export namespace FeedEntry {
  export type Fragment = {
    __typename?: 'Entry';
    id: number;
    commentCount: number;
    repository: Repository;
  } & VoteButtons.Fragment &
    RepoInfo.Fragment;

  export type Repository = {
    __typename?: 'Repository';
    full_name: string;
    html_url: string;
    owner?: Owner | null;
  };

  export type Owner = {
    __typename?: 'User';
    avatar_url: string;
  };
}

export namespace RepoInfo {
  export type Fragment = {
    __typename?: 'Entry';
    createdAt: number;
    repository: Repository;
    postedBy: PostedBy;
  };

  export type Repository = {
    __typename?: 'Repository';
    description?: string | null;
    stargazers_count: number;
    open_issues_count?: number | null;
  };

  export type PostedBy = {
    __typename?: 'User';
    html_url: string;
    login: string;
  };
}

export namespace VoteButtons {
  export type Fragment = {
    __typename?: 'Entry';
    score: number;
    vote: Vote;
  };

  export type Vote = {
    __typename?: 'Vote';
    vote_value: number;
  };
}

import * as ReactApollo from 'react-apollo';

export namespace OnCommentAdded {
  export class Component extends ReactApollo.Subscription<Subscription, Variables> {}
}
export namespace Comment {
  export class Component extends ReactApollo.Query<Query, Variables> {}
}
export namespace CurrentUserForProfile {
  export class Component extends ReactApollo.Query<Query, Variables> {}
}
export namespace Feed {
  export class Component extends ReactApollo.Query<Query, Variables> {}
}
export namespace SubmitRepository {
  export class Component extends ReactApollo.Mutation<Mutation, Variables> {}
}
export namespace SubmitComment {
  export class Component extends ReactApollo.Mutation<Mutation, Variables> {}
}
export namespace Vote {
  export class Component extends ReactApollo.Mutation<Mutation, Variables> {}
}