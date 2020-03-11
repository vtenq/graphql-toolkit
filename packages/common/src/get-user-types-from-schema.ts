import { GraphQLSchema, GraphQLObjectType, isObjectType, isIntrospectionType } from 'graphql';

/**
 * Get all GraphQL types from schema without:
 *
 * - Query, Mutation, Subscription objects
 * - Internal scalars added by parser
 *
 * @param schema
 */
export function getUserTypesFromSchema(schema: GraphQLSchema): GraphQLObjectType[] {
  const allTypesMap = schema.getTypeMap();

  const rootTypeNames = [schema.getQueryType(), schema.getMutationType(), schema.getSubscriptionType()].map(type => type?.name);

  const modelTypes = Object.values(allTypesMap).filter(graphqlType => isObjectType(graphqlType) && !isIntrospectionType(graphqlType) && !rootTypeNames.includes(graphqlType.name));

  return modelTypes as GraphQLObjectType[];
}
