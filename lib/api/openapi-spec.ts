export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Loconomy API',
    description: 'AI-First Local Economy Platform - Comprehensive API for service providers, customers, and AI agents',
    version: '2.0.0',
    contact: {
      name: 'Loconomy API Support',
      email: 'api@loconomy.com',
      url: 'https://docs.loconomy.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'https://api.loconomy.com/v2',
      description: 'Production server'
    },
    {
      url: 'https://staging-api.loconomy.com/v2',
      description: 'Staging server'
    },
    {
      url: 'http://localhost:3000/api',
      description: 'Development server'
    }
  ],
  paths: {
    // Authentication endpoints
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register new user',
        description: 'Create a new user account with email verification',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RegisterResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/auth/verify-email': {
      post: {
        tags: ['Authentication'],
        summary: 'Verify email address',
        description: 'Verify user email with token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: {
                    type: 'string',
                    description: 'Email verification token'
                  }
                },
                required: ['token']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Email verified successfully'
          },
          '400': {
            description: 'Invalid or expired token'
          }
        }
      }
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Request password reset',
        description: 'Send password reset email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    format: 'email'
                  }
                },
                required: ['email']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Reset email sent if account exists'
          }
        }
      }
    },
    '/auth/reset-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Reset password',
        description: 'Reset password with token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: {
                    type: 'string'
                  },
                  password: {
                    type: 'string',
                    minLength: 6
                  }
                },
                required: ['token', 'password']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Password reset successfully'
          },
          '400': {
            description: 'Invalid or expired token'
          }
        }
      }
    },

    // AI Agent endpoints
    '/ai/agent': {
      post: {
        tags: ['AI Agent'],
        summary: 'Process AI agent input',
        description: 'Send input to AI agent for processing with slash commands and natural language',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AgentRequest'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Agent response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AgentResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized'
          }
        }
      },
      get: {
        tags: ['AI Agent'],
        summary: 'Get agent information',
        description: 'Get suggestions, commands, or memory',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'action',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              enum: ['suggestions', 'commands', 'memory']
            }
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Agent information'
          }
        }
      }
    },

    // Search endpoints
    '/search': {
      get: {
        tags: ['Search'],
        summary: 'Search services',
        description: 'Search services with filters and AI-powered ranking',
        parameters: [
          {
            name: 'q',
            in: 'query',
            schema: {
              type: 'string'
            },
            description: 'Search query'
          },
          {
            name: 'category',
            in: 'query',
            schema: {
              type: 'string'
            }
          },
          {
            name: 'location',
            in: 'query',
            schema: {
              type: 'string'
            }
          },
          {
            name: 'priceMin',
            in: 'query',
            schema: {
              type: 'number'
            }
          },
          {
            name: 'priceMax',
            in: 'query',
            schema: {
              type: 'number'
            }
          },
          {
            name: 'rating',
            in: 'query',
            schema: {
              type: 'number',
              minimum: 1,
              maximum: 5
            }
          },
          {
            name: 'verified',
            in: 'query',
            schema: {
              type: 'boolean'
            }
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              default: 20,
              maximum: 100
            }
          }
        ],
        responses: {
          '200': {
            description: 'Search results',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SearchResponse'
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Search'],
        summary: 'Advanced search operations',
        description: 'Get popular services, personalized recommendations, etc.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  action: {
                    type: 'string',
                    enum: ['popular', 'suggestions', 'categories', 'locations']
                  },
                  userId: {
                    type: 'string'
                  },
                  limit: {
                    type: 'integer',
                    default: 10
                  }
                },
                required: ['action']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Search results'
          }
        }
      }
    },

    // Services endpoints
    '/services': {
      get: {
        tags: ['Services'],
        summary: 'List services',
        description: 'Get paginated list of services',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              default: 1
            }
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              default: 20,
              maximum: 100
            }
          },
          {
            name: 'category',
            in: 'query',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'List of services',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ServicesResponse'
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Services'],
        summary: 'Create service',
        description: 'Create a new service listing',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateServiceRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Service created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Service'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized'
          }
        }
      }
    },
    '/services/{id}': {
      get: {
        tags: ['Services'],
        summary: 'Get service by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Service details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Service'
                }
              }
            }
          },
          '404': {
            description: 'Service not found'
          }
        }
      },
      put: {
        tags: ['Services'],
        summary: 'Update service',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateServiceRequest'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Service updated'
          },
          '401': {
            description: 'Unauthorized'
          },
          '403': {
            description: 'Forbidden'
          },
          '404': {
            description: 'Service not found'
          }
        }
      },
      delete: {
        tags: ['Services'],
        summary: 'Delete service',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '204': {
            description: 'Service deleted'
          },
          '401': {
            description: 'Unauthorized'
          },
          '403': {
            description: 'Forbidden'
          },
          '404': {
            description: 'Service not found'
          }
        }
      }
    },

    // Bookings endpoints
    '/bookings': {
      get: {
        tags: ['Bookings'],
        summary: 'List user bookings',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']
            }
          },
          {
            name: 'role',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['customer', 'provider']
            }
          }
        ],
        responses: {
          '200': {
            description: 'List of bookings'
          }
        }
      },
      post: {
        tags: ['Bookings'],
        summary: 'Create booking',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateBookingRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Booking created'
          },
          '401': {
            description: 'Unauthorized'
          }
        }
      }
    },

    // Notifications endpoints
    '/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'Get user notifications',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              default: 20
            }
          },
          {
            name: 'unread',
            in: 'query',
            schema: {
              type: 'boolean'
            }
          }
        ],
        responses: {
          '200': {
            description: 'List of notifications'
          }
        }
      },
      post: {
        tags: ['Notifications'],
        summary: 'Create notification',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateNotificationRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Notification created'
          }
        }
      }
    },

    // File upload endpoints
    '/upload': {
      post: {
        tags: ['Files'],
        summary: 'Upload file',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary'
                  },
                  type: {
                    type: 'string',
                    enum: ['AVATAR', 'SERVICE_IMAGE', 'DOCUMENT', 'CERTIFICATE', 'OTHER']
                  }
                },
                required: ['file']
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'File uploaded successfully'
          },
          '400': {
            description: 'Invalid file'
          }
        }
      },
      get: {
        tags: ['Files'],
        summary: 'List user files',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'type',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['AVATAR', 'SERVICE_IMAGE', 'DOCUMENT', 'CERTIFICATE', 'OTHER']
            }
          }
        ],
        responses: {
          '200': {
            description: 'List of files'
          }
        }
      },
      delete: {
        tags: ['Files'],
        summary: 'Delete file',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'query',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'File deleted'
          },
          '404': {
            description: 'File not found'
          }
        }
      }
    }
  },

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      RegisterRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 100
          },
          email: {
            type: 'string',
            format: 'email'
          },
          password: {
            type: 'string',
            minLength: 6,
            maxLength: 128
          },
          role: {
            type: 'string',
            enum: ['CUSTOMER', 'PROVIDER', 'ADMIN']
          }
        },
        required: ['name', 'email', 'password', 'role']
      },
      RegisterResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string'
          },
          userId: {
            type: 'string'
          },
          emailSent: {
            type: 'boolean'
          }
        }
      },
      AgentRequest: {
        type: 'object',
        properties: {
          input: {
            type: 'string',
            description: 'User input or slash command'
          },
          context: {
            type: 'object',
            properties: {
              currentPage: {
                type: 'string'
              },
              location: {
                type: 'string'
              },
              sessionMemory: {
                type: 'object'
              }
            }
          }
        },
        required: ['input']
      },
      AgentResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean'
          },
          response: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['text', 'action', 'ui', 'redirect', 'form']
              },
              content: {
                type: 'string'
              },
              data: {
                type: 'object'
              },
              actions: {
                type: 'array',
                items: {
                  type: 'object'
                }
              }
            }
          },
          context: {
            type: 'object'
          }
        }
      },
      SearchResponse: {
        type: 'object',
        properties: {
          results: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/SearchResult'
            }
          },
          total: {
            type: 'integer'
          },
          query: {
            type: 'string'
          },
          filters: {
            type: 'object'
          }
        }
      },
      SearchResult: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          content: {
            type: 'string'
          },
          similarity: {
            type: 'number',
            minimum: 0,
            maximum: 1
          },
          metadata: {
            $ref: '#/components/schemas/Service'
          }
        }
      },
      Service: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          title: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          category: {
            type: 'string'
          },
          price: {
            type: 'number'
          },
          location: {
            type: 'string'
          },
          rating: {
            type: 'number'
          },
          reviewCount: {
            type: 'integer'
          },
          provider: {
            $ref: '#/components/schemas/Provider'
          },
          images: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          tags: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'DRAFT']
          }
        }
      },
      Provider: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          image: {
            type: 'string'
          },
          verified: {
            type: 'boolean'
          },
          rating: {
            type: 'number'
          }
        }
      },
      CreateServiceRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            minLength: 5,
            maxLength: 200
          },
          description: {
            type: 'string',
            minLength: 20,
            maxLength: 2000
          },
          category: {
            type: 'string'
          },
          price: {
            type: 'number',
            minimum: 0
          },
          location: {
            type: 'string'
          },
          duration: {
            type: 'integer',
            minimum: 15
          },
          images: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        },
        required: ['title', 'description', 'category', 'price', 'location']
      },
      UpdateServiceRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          price: {
            type: 'number'
          },
          location: {
            type: 'string'
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE', 'DRAFT']
          }
        }
      },
      CreateBookingRequest: {
        type: 'object',
        properties: {
          serviceId: {
            type: 'string'
          },
          scheduledAt: {
            type: 'string',
            format: 'date-time'
          },
          notes: {
            type: 'string'
          }
        },
        required: ['serviceId', 'scheduledAt']
      },
      CreateNotificationRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string'
          },
          message: {
            type: 'string'
          },
          data: {
            type: 'object'
          },
          targetUserId: {
            type: 'string'
          }
        },
        required: ['title', 'message']
      },
      ServicesResponse: {
        type: 'object',
        properties: {
          services: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Service'
            }
          },
          pagination: {
            type: 'object',
            properties: {
              page: {
                type: 'integer'
              },
              limit: {
                type: 'integer'
              },
              total: {
                type: 'integer'
              },
              totalPages: {
                type: 'integer'
              }
            }
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string'
          },
          code: {
            type: 'string'
          },
          details: {
            type: 'object'
          }
        },
        required: ['message']
      }
    }
  },
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and account management'
    },
    {
      name: 'AI Agent',
      description: 'AI-powered assistant and slash commands'
    },
    {
      name: 'Search',
      description: 'Service search with AI-powered ranking and recommendations'
    },
    {
      name: 'Services',
      description: 'Service listing management'
    },
    {
      name: 'Bookings',
      description: 'Booking management and workflows'
    },
    {
      name: 'Notifications',
      description: 'Real-time notifications and messaging'
    },
    {
      name: 'Files',
      description: 'File upload and management'
    }
  ]
};