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


@RunWith(AndroidJUnit4.class)
@LargeTest
public class btest {

    @Rule
    public ActivityTestRule<SplashActivity> mActivityTestRule = new ActivityTestRule<>(SplashActivity.class);

    @Test
    public void btest() {

//        android.os.SystemClock.sleep(5000);

        ViewInteraction reactEditText =  onView(allOf(withContentDescription("nameinput,"), isDisplayed()));
        reactEditText.perform(replaceText("test"), closeSoftKeyboard());

        ViewInteraction reactEditText2 = onView(allOf(withText("test"), isDisplayed()));
        reactEditText2.perform(pressImeActionButton());

        ViewInteraction reactViewGroup1 =
                onView(allOf(withContentDescription("gendertouch,"), isDisplayed()));
        reactViewGroup1.perform(click());

        ViewInteraction reactViewText1 =
                onView(allOf(withContentDescription("touchdown,"), isDisplayed()));
        reactViewText1.perform(click());

        ViewInteraction reactViewText2 =
                onView(allOf(withContentDescription("touchup,"), isDisplayed()));
        reactViewText2.perform(click());

        ViewInteraction reactViewGroup2 =
                onView(allOf(withContentDescription("logintouch,"), isDisplayed()));
        reactViewGroup2.perform(click());

        ViewInteraction reactViewText3 =
                onView(allOf(withContentDescription("agreetouch,"), isDisplayed()));
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
