<?php
/**
 * The Template for displaying course archives, including the course page template.
 *
 */
?>


	<?php if ( have_posts() ) : ?>

      <ul class="course-container rspl-archive-course-container" >
      
        <?php
        /*
        * Loop through all courses
        */
        while ( have_posts() ) {
          the_post();

          //  sensei_load_template_part( 'content', 'course' );
          ?>

          <li <?php post_class( Sensei_Course::get_course_loop_content_class() ); ?> >

            <a href="<?php echo get_permalink(); ?>" class="rspl-archive-course-link rspl-archive-course-img-wrap">
              <img src="<?php echo get_the_post_thumbnail_url() ?>" alt="" class="rspl-archive-course-thumbnail">
            </a>

            <div class="rspl-archive-course-content">
              <a href="<?php echo get_permalink(); ?>" class="rspl-archive-course-link">
                <h3 class="rspl-archive-course-title"><?php the_title(); ?></h3>
              </a>
              <?php
              $course = get_the_ID();
              $lesson_count = Sensei()->course->course_lesson_count( absint( $course ) );
            
              echo '<span class="rspl-archive-course-lesson-count">' .
                    // translators: Placeholder %d is the lesson count.
                    esc_html( sprintf( _n( '%d Lesson', '%d Lessons', $lesson_count, 'sensei-lms' ), $lesson_count ) ) .
                  '</span>'; 
              ?>
            </div> <!-- .course-content -->

          </li>
        
        <?php  //  sensei_load_template_part( 'content', 'course' ); //
        }
        ?>
      
      </ul>  

	<?php else : ?>

		<p><?php esc_html_e( 'No courses found that match your selection.', 'sensei-lms' ); ?></p>

	<?php endif; ?>

