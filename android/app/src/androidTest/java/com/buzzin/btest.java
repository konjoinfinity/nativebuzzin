package com.buzzin;

import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import androidx.test.espresso.ViewInteraction;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;
import androidx.test.runner.AndroidJUnit4;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.*;
import static androidx.test.espresso.matcher.ViewMatchers.*;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.startsWith;


@RunWith(AndroidJUnit4.class)
@LargeTest
public class btest {

    @Rule
    public ActivityTestRule<MainActivity> mActivityTestRule = new ActivityTestRule<>(MainActivity.class);

    private String nameInput = "id/0x13";
    private String genderButton = "gendertouch";
    private String numInputDown = "touchdown";
    private String numInputUp = "touchup,";
    private String loginButton = "logintouch,";
    private String agreeButton = "agreetouch,";

    @Test
    public void btest() {

            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }


        onView(allOf(withResourceName(nameInput), isDisplayed()))
                    .perform(replaceText("test"), closeSoftKeyboard())
                    .perform(pressImeActionButton());
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }


        ViewInteraction reactViewGroup1 =
                onView(allOf(withContentDescription("gendertouch"), isDisplayed()));
        reactViewGroup1.perform(click());

        ViewInteraction reactViewText1 =
                onView(allOf(withContentDescription("touchdown"), isDisplayed()));
        reactViewText1.perform(click());

        ViewInteraction reactViewText2 =
                onView(allOf(withContentDescription("touchup"), isDisplayed()));
        reactViewText2.perform(click());

        ViewInteraction reactViewGroup2 =
                onView(allOf(withContentDescription("logintouch"), isDisplayed()));
        reactViewGroup2.perform(click());

        ViewInteraction reactViewText3 =
                onView(allOf(withContentDescription("agreetouch"), isDisplayed()));
        reactViewText3.perform(click());

    }

    private static Matcher<View> childAtPosition(
            final Matcher<View> parentMatcher, final int position) {

        return new TypeSafeMatcher<View>() {
            @Override
            public void describeTo(Description description) {
                description.appendText("Child at position " + position + " in parent ");
                parentMatcher.describeTo(description);
            }

            @Override
            public boolean matchesSafely(View view) {
                ViewParent parent = view.getParent();
                return parent instanceof ViewGroup && parentMatcher.matches(parent)
                        && view.equals(((ViewGroup) parent).getChildAt(position));
            }
        };
    }
}
