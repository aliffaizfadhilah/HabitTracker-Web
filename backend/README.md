<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## ERD

<!-- mermaid-erd-start -->
```mermaid
---
title: 16 tables · 138 columns
---
erDiagram
    activity_logs["activity_logs (6) · ActivityLog"] {
        bigint id PK
        bigint id_activity FK
        date date "cast: date"
        tinyint status "default: 1"
        timestamp created_at "nullable"
        timestamp updated_at "nullable"
    }
    follows["follows (3)"] {
        bigint id PK
        timestamp created_at "nullable"
        timestamp updated_at "nullable"
    }
    habit_activities["habit_activities (5) · Activity"] {
        bigint id_activity PK
        bigint id_habit FK
        varchar name
        timestamp created_at "nullable"
        timestamp updated_at "nullable"
    }
    habits["habits (16) · Habit"] {
        bigint id_habit PK
        varchar username FK
        varchar title
        varchar category
        date periode_start "cast: date"
        date periode_end "cast: date"
        int total_period_days "default: 0"
        int total_completed_days "default: 0"
        int current_streak "default: 0"
        int longest_streak "default: 0"
        decimal progress_percent "cast: decimal:2, default: 0.00"
        tinyint status "cast: boolean, default: 1"
        time reminder_time "nullable"
        tinyint reminder_enabled "cast: boolean, default: 1"
        timestamp created_at "nullable"
        timestamp updated_at "nullable"
    }
    notifications["notifications (3) · Notification"] {
        bigint id PK
        timestamp created_at "nullable"
        timestamp updated_at "nullable"
    }
    post_comments["post_comments (6) · PostComment"] {
        bigint id PK
        bigint post_id FK
        bigint user_id FK
        text content
        timestamp created_at "nullable"
        timestamp updated_at "nullable"
    }
    post_likes["post_likes (5) · PostLike"] {
        bigint id PK
        bigint post_id FK
        bigint user_id FK
        timestamp created_at "nullable"
        timestamp updated_at "nullable"
    }
    posts["posts (14) · Post"] {
        bigint id PK
        bigint user_id FK
        bigint habit_id "nullable"
        varchar title
        text caption "nullable"
        varchar image_path
        varchar habit_title "nullable"
        decimal progress_percent "cast: decimal:2, nullable"
        int likes_count "default: 0"
        int comments_count "default: 0"
        tinyint is_private "cast: boolean, default: 0"
        varchar frame_style "default: rect"
        timestamp created_at "nullable"
        timestamp updated_at "nullable"
    }
    posts_and_notes["posts_and_notes (3)"] {
        bigint id PK
        timestamp created_at "nullable"
        timestamp updated_at "nullable"
    }
    reports["reports (12) · Report"] {
        bigint id PK
        bigint user_id FK "nullable"
        enum type "default: bug"
        bigint target_id "nullable"
        varchar reason "nullable"
        text note "nullable"
        varchar page "nullable"
        varchar browser "nullable"
        enum status "default: pending"
        timestamp resolved_at "cast: datetime, nullable"
        timestamp created_at "nullable"
        timestamp updated_at "nullable"
    }
    roles["roles (5) · Role"] {
        bigint id PK
        varchar role_name UK
        text description "nullable"
        timestamp created_at "nullable"
        timestamp updated_at "nullable"
    }
    shetabit_visits["shetabit_visits (19)"] {
        bigint id PK
        varchar method "nullable"
        mediumtext request "nullable"
        mediumtext url "nullable"
        mediumtext referer "nullable"
        text languages "nullable"
        text useragent "nullable"
        text headers "nullable"
        text device "nullable"
        text platform "nullable"
        text browser "nullable"
        varchar ip "nullable"
        json geo_raw "nullable"
        varchar visitable_type "polymorphic, nullable"
        bigint visitable_id "polymorphic, nullable"
        varchar visitor_type "polymorphic, nullable"
        bigint visitor_id "polymorphic, nullable"
        timestamp created_at "nullable"
        timestamp updated_at "nullable"
    }
    user_roles["user_roles (5)"] {
        bigint id PK
        bigint user_id FK
        bigint role_id FK
        timestamp created_at "nullable"
        timestamp updated_at "nullable"
    }
    user_tokens["user_tokens (3)"] {
        bigint id PK
        timestamp created_at "nullable"
        timestamp updated_at "nullable"
    }
    users["users (19) · User"] {
        bigint id PK
        varchar username UK
        varchar email UK
        varchar google_id "nullable"
        varchar otp_code "nullable"
        timestamp otp_expires_at "cast: datetime, nullable"
        varchar password
        varchar salt "nullable"
        varchar full_name "nullable"
        text bio "nullable"
        varchar profile_picture "nullable"
        date date_of_birth "nullable"
        varchar gender "nullable"
        time reminder_time "nullable"
        tinyint reminder_enabled "default: 0"
        tinyint is_verified "default: 0"
        tinyint is_active "default: 1"
        timestamp created_at "nullable"
        timestamp updated_at "nullable"
    }
    visitor_logs["visitor_logs (14) · VisitorLog"] {
        bigint id PK
        varchar ip_address
        varchar country "nullable"
        varchar city "nullable"
        varchar session_id "nullable"
        varchar device_type "nullable"
        varchar browser "nullable"
        varchar browser_version "nullable"
        varchar os "nullable"
        varchar language "nullable"
        varchar page "default: /"
        varchar referer "nullable"
        timestamp created_at "nullable"
        timestamp updated_at "nullable"
    }
    habit_activities ||--o{ activity_logs : "has many via id_activity, cascade delete"
    habits ||--o{ habit_activities : "has many via id_habit, cascade delete"
    users ||--o{ habits : "has many via username, cascade delete"
    posts ||--o{ post_comments : "has many via post_id, cascade delete"
    users ||--o{ post_comments : "has many via user_id, cascade delete"
    posts ||--o{ post_likes : "pivot, has many via post_id, cascade delete"
    users ||--o{ post_likes : "pivot, has many via user_id, cascade delete"
    users ||--o{ posts : "has many via user_id, cascade delete"
    habits |o--o{ posts : "guessed has many via habit_id, no index"
    users |o--o{ reports : "has many via user_id, set null delete"
    roles ||--o{ user_roles : "pivot, has many via role_id, cascade delete"
    users ||--o{ user_roles : "pivot, has many via user_id, cascade delete"
%% Unmapped polymorphic relations (add to config 'mermaid-erd.polymorphic_relationships'):
%%   shetabit_visits.visitable (visitable_type + visitable_id)
%%   shetabit_visits.visitor (visitor_type + visitor_id)
```
<!-- mermaid-erd-end -->
